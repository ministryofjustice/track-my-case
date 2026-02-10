import express, { NextFunction, Request, Response, Router } from 'express'
import { httpRequestDuration, httpRequestsTotal } from '../services/prometheusService'

// HTTP Code 499 means that the client closed the connection before the server answered the request
const CLIENT_CLOSED_CONNECTION_HTTP_STATUS_CODE_499 = 499

// The HTTP status code 598 Network Read Timeout Error is primarily used as an informal convention to indicate
// the HTTP client is unable to make a HTTP Connection to the network due to a read timeout,
// and the HTTP request remains unfulfilled.
const NETWORK_READ_ERROR_HTTP_STATUS_CODE_598 = 598

export default function setUpPrometheusMetrics(): Router {
  const router = express.Router()

  /**
   * Middleware to capture HTTP requests for Prometheus metrics.
   *
   * This middleware listens for both "finish" (normal completion) and "close" (aborted connection) events
   * on the response object and then increments the `httpRequestsTotal` counter.
   * The counter is updated with labels for the HTTP method, the request path, and the response status code.
   * This helps to differentiate between successful responses (2xx), client errors (4xx), and server errors (5xx).
   */
  router.use((req: Request, res: Response, next: NextFunction) => {
    const method = req.method.toUpperCase()
    const route = req.path

    const endDuration = httpRequestDuration.startTimer({
      method,
      route,
    })

    /**
     * Increment the {@link httpRequestsTotal} counter for this request
     * and observe request duration in the {@link httpRequestDuration} histogram.
     *
     * @param {number} [statusOverride] - Optional HTTP‑status code to record
     *   instead of `res.statusCode`.  Pass `499` when the client aborts the
     *   connection; otherwise leave it `undefined` so the real response status
     *   is used.
     * @returns {void}
     */
    const logMetrics = (statusOverride?: number): void => {
      const statusCode = String(statusOverride ?? res.statusCode)
      const labels = {
        method,
        route,
        status_code: statusCode,
      }
      httpRequestsTotal.inc(labels)
      endDuration(labels)
    }

    /**
     * Handler for the "finish" event on the response.
     *
     * When the response finishes normally, this handler calls logMetrics to record the metrics
     * and then removes the "close" listener to prevent duplicate cleanup.
     *
     * @returns {void}
     */
    const finishHandler = () => {
      logMetrics()
      // Remove the "close" listener so that it won't be called later.
      res.off('close', closeHandler)
    }

    /**
     * Handler for the "close" event on the response.
     *
     * If the connection is aborted before the response finishes, this handler removes the "finish"
     * listener to prevent it from firing later.
     *
     * @returns {void}
     */
    const closeHandler = () => {
      logMetrics(CLIENT_CLOSED_CONNECTION_HTTP_STATUS_CODE_499)
      // Remove the "finish" listener if the response did not complete normally.
      res.off('finish', finishHandler)
    }

    // Use `once` to ensure each handler only fires one time per request.
    res.once('finish', finishHandler)
    res.once('close', closeHandler)

    // ------------------------------------------------------------------
    // Failsafe: if NEITHER finish nor close fires within 5 min, clean up
    // ------------------------------------------------------------------
    const RESPONSE_TIMEOUT_MS = 5 * 60 * 1000
    res.setTimeout(RESPONSE_TIMEOUT_MS, () => {
      logMetrics(NETWORK_READ_ERROR_HTTP_STATUS_CODE_598) // 598 - network read timeout
      res.off('finish', finishHandler)
      res.off('close', closeHandler)
    })

    next()
  })
  return router
}

// const updateMetrics =
// app.use(updateMetrics)
