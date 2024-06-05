enum Status {
  idle,
  pending,
  success,
  error,
}

export class StateStatus {
  constructor(public state: Status, public errorMessage?: string) {}

  static idle(): StateStatus {
    return new StateStatus(Status.idle, undefined)
  }

  static pending(): StateStatus {
    return new StateStatus(Status.pending, undefined)
  }

  static success(): StateStatus {
    return new StateStatus(Status.success, undefined)
  }

  static error(message: string): StateStatus {
    return new StateStatus(Status.error, message)
  }
}
