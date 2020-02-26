import BaseCommand from './BaseCommand'

export default class extends BaseCommand {
  get kind() {
    return new Set(['configuration_command'])
  }
}
