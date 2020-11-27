import BaseCommand from './BaseCommand'

export default class ConfigurationCommand extends BaseCommand {
  get kind() {
    return new Set(['configuration_command'])
  }
}
