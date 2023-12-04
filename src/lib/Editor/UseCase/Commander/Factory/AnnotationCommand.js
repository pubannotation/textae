import BaseCommand from './BaseCommand'

export default class AnnotationCommand extends BaseCommand {
  get kind() {
    return new Set(['annotation_command'])
  }
}
