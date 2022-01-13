export function ImageRatio(
  props: {
    src?: string;
  }
) {
  return (
    <div className="ratio ratio-16x9">
      {
        props.src ?
        <img src={props.src} /> :
        <div className="text-center">No image provided</div>
      }
    </div>
  )
}
