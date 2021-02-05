export default class Commands {
  constructor(command) {
    this.command = command
  }

  // Summarizes whether the included command affects Annotation or Configuration,
  // and determines whether there is content to be saved in Annotation or Configuration.
  get kind() {
    return this.command.kind
  }
}
