export interface FormError {
  text: string
  href: string
}

export interface FormState<T> {
  errors?: FormError[]
  formData?: T
}
