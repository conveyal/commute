export function actUponConfirmation (confirmationMessage, action) {
  if (window.confirm(confirmationMessage)) {
    action()
  }
}
