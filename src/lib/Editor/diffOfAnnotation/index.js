import { diff } from 'jsondiffpatch'
import prepare from './prepare'

export default function diffOfAnnotation(oldAnnotation, newAnnotation) {
  return diff(prepare(oldAnnotation), prepare(newAnnotation))
}
