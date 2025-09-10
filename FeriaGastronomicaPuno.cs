using System;
using System.Diagnostics;
using System.Windows.Forms;

namespace FeriaGastronomicaPuno
{
    class Program
    {
        [STAThread]
        static void Main()
        {
            string ipServidor = "172.80.15.89";
            string puertoFrontend = "5173";
            string urlFrontend = "http://" + ipServidor + ":" + puertoFrontend;

            // Mostrar mensaje de inicio
            string mensaje = "FERIA GASTRONOMICA PUNO - SISTEMA WEB\n\n" +
                "Se abrira el navegador con la aplicacion web\n\n" +
                "• URL: " + urlFrontend + "\n" +
                "• IP del Servidor: " + ipServidor + "\n" +
                "• Puerto Frontend: " + puertoFrontend + "\n\n" +
                "Comparte esta URL con otros dispositivos en la red\n\n" +
                "¿Continuar?";

            DialogResult result = MessageBox.Show(
                mensaje,
                "Feria Gastronomica Puno",
                MessageBoxButtons.YesNo,
                MessageBoxIcon.Information
            );

            if (result == DialogResult.Yes)
            {
                try
                {
                    // Abrir navegador con la URL
                    Process.Start(urlFrontend);

                    // Mensaje de confirmación
                    string confirmacion = "Navegador abierto exitosamente!\n\n" +
                        "URL para otros dispositivos:\n" + urlFrontend + "\n\n" +
                        "El sistema esta listo para usar.";

                    MessageBox.Show(
                        confirmacion,
                        "Sistema Iniciado",
                        MessageBoxButtons.OK,
                        MessageBoxIcon.Information
                    );
                }
                catch (Exception ex)
                {
                    string error = "Error al abrir el navegador:\n" + ex.Message + "\n\n" +
                        "Abre manualmente: " + urlFrontend;

                    MessageBox.Show(
                        error,
                        "Error",
                        MessageBoxButtons.OK,
                        MessageBoxIcon.Error
                    );
                }
            }
        }
    }
}
