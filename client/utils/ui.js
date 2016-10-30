export function actUponConfirmation (confirmationMessage, action) {
  return () => {
    if (window.confirm(confirmationMessage)) {
      action()
    }
  }
}
