import Head from "next/head";
import { AgendamentoForm } from "../../components/appointmentForm/appointmentForm";

export default function SimularAgendamentoPage() {
  return (
    <>
      <Head>
        <title>Solicitar agendamento</title>
      </Head>
      <AgendamentoForm />
    </>
  );
}
