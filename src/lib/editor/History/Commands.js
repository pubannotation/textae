export default class Commands {
  constructor(command) {
    this.commands = [command]
  }

  // Summarizes whether the included command affects Annotation or Configuration,
  // and determines whether there is content to be saved in Annotation or Configuration.
  get kinds() {
    return this.commands.reduce(
      (acc, curr) => new Set([...acc, ...curr.kind]),
      new Set()
    )
  }
}
