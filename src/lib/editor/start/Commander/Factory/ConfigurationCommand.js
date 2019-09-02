import BaseCommand from './BaseCommand'

export default class extends BaseCommand {
  get kind() {
    return ['configuration_command']
  }
}
