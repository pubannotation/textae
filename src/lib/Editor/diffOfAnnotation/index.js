import { diff } from 'jsondiffpatch'
import sortByID from './sortByID'

export default function diffOfAnnotation(oldAnnotation, newAnnotation) {
  return diff(sortByID(oldAnnotation), sortByID(newAnnotation))
}
