interface Props {
  params: { id: string };
}

export default function EditarProyectoPage({ params }: Props) {
  return <h1>Editar proyecto: {params.id}</h1>;
}
