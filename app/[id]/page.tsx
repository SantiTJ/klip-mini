export default function Detalle({ params }: { params: { id: string } }) {
  return <h1>Proyecto con ID: {params.id}</h1>;
}
