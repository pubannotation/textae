import LesserMap from './LesserMap'

export default function() {
  // The chache for position of grids.
  // This is updated at arrange position of grids.
  // This is referenced at create or move relations.
  return new LesserMap()
}
