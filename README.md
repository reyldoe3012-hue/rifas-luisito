Rifa Luisito

Página estática para vender números del 1 al 1000 a $1.50 cada uno y realizar un sorteo local.

Nuevas funcionalidades:
- Registro e inicio de sesión de usuarios (datos locales, sin servidor).
- Las compras se asocian a usuarios.
- Simulación de pago: al comprar se muestran instrucciones bancarias y debes pulsar "Confirmar pago" una vez realices la transferencia. (No se integró pasarela de pago real).
- Ajustes locales para datos bancarios (banco, cuenta, cédula, teléfono). Estos datos se guardan en el navegador.
- Sorteo con 5 premios: Celular, Moto, TV, Cocina (licuadora) y $1000 efectivo.

Cómo probar
1. Abrir `rifaluisito/index.html` en el navegador.
2. Crear un usuario en "Crear usuario". Luego iniciar sesión en "Entrar".
3. En "Comprar número" ingresa contacto y número opcional o deja vacío para asignar aleatorio.
4. Haz clic en "Comprar". Se mostrará un mensaje con instrucciones de pago. Después de realizar la transferencia real (fuera de esta app) pulsa "Confirmar pago".
5. Para ver la lista de vendidos haz clic en "Ver vendidos".
6. En "Sorteo" ingresa la contraseña admin (por defecto `admin123`) y pulsa "Realizar sorteo".

Notas de seguridad y legales
- Esta página es local y guarda datos en el navegador. No es adecuada para producción.
- No se incorporó procesamiento de pagos. Para aceptar pagos reales se necesita integrar una pasarela (Stripe, PayPal) y un servidor que reciba notificaciones y confirme transacciones.
- No incluyas aquí datos sensibles si compartes tu equipo.

Datos sugeridos de pago (ejemplo local)
- Banco: "Banco de Venezuela"
- Cédula: 26196404
- Teléfono: 04244451788
- (Puedes editarlos en la sección de Ajustes)

Datos provistos por el organizador (puedes copiarlos desde la interfaz):
- Pago móvil / Cédula: 26196404
- Teléfono: 04244451788
- Banco sugerido: Banco de Venezuela
