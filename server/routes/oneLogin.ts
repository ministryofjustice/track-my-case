import express, { Application, Express, NextFunction, Request, Response } from "express";
import asyncMiddleware from '../middleware/asyncMiddleware.js'
import { OneLoginConfig } from '../one-login-config'
import { AuthenticatedUser, isAuthenticated } from '../helpers/user-status';
import { authorizeController } from "../controllers/authorize/authorize-controller";
import { callbackController } from "../controllers/callback/callback-controller";
import { logoutController } from "../controllers/logout/logout-controller";

export default function routes(app: express.Express): void {

  const clientConfig = OneLoginConfig.getInstance();

  // const router = Router()

  app.get("/oidc/login", (req, res, next) =>
    authorizeController(req, res, next, false)
  );

  app.get("/oidc/verify", (req: Request, res: Response, next: NextFunction) =>
    authorizeController(req, res, next, true)
  );

  app.get("/oidc/authorization-code/callback", (req: Request, res: Response, next: NextFunction) =>
    callbackController(req, res, next)
  );

  app.get("/signed-in", AuthenticatedUser, (req, res) => {
    res.render(
      "pages/signed-in.njk",
      {
        authenticated: true,
        identitySupported: clientConfig.getIdentitySupported(),
        // page config
        serviceName: "Track My Case",
        resultData: req.session.user,
        // Service header config
        oneLoginLink: clientConfig.getNodeEnv() == "development" ? "https://home.integration.account.gov.uk/" : "https://home.account.gov.uk/",
        homepageLink: "https://www.gov.uk/",
        signOutLink: "http://localhost:9999/oidc/logout"
      }
    );
  });


  // Page: Select your case
  app.get("/oidc/logout", (req: Request, res: Response, next: NextFunction) =>
    logoutController(req, res, next)
  );

  // app.get("/landing-page", (req: Request, res: Response, next: NextFunction) => {
  //   // set flag to say user came via post office landing page
  //   res.cookie("post-office", true, {
  //     httpOnly: true,
  //   });
  //   authorizeController(req, res, next, false)
  // });

  app.get("/signed-out", (req: Request, res: Response) => {
    res.render("pages/signed-out.njk",
      {
        serviceName: "Track My Case",
      }
    );
  });

  app.get("/start", async (req, res) => {
    res.render("pages/start",
      {
        authenticated: isAuthenticated(req, res),
        serviceName: "Track My Case",
        // GOV.UK header config
        homepageUrl: "https://gov.uk",
        serviceUrl: `${clientConfig.getServiceUrl()}`
      }
    );
  });

}
