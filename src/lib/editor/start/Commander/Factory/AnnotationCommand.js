import BaseCommand from './BaseCommand'

export default class extends BaseCommand {
  get kind() {
    return new Set(['annotation_command'])
  }
}
