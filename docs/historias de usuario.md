## **Historias de Usuario y Documentación de Prompts**

A continuación, se presentan las historias de usuario detalladas, acompañadas de los documentos de prompt diseñados para que el agente de Firebase Studio genere el código de manera precisa, siguiendo la arquitectura vertical especificada.

### **Historia de Usuario 1: Gestión de Planes y Cuentas de Administrador**

**Descripción**: Como Super Admin, deseo definir planes de suscripción que limiten la cantidad de consorcios y el tiempo de uso para cada administrador, con el fin de monetizar la plataforma. **Criterios de Aceptación**:

* Creación de planes (Bronce, Plata, Oro).  
* Control de vigencia de la suscripción.  
* Bloqueo de creación de nuevos consorcios si se excede el límite del plan.

#### **Documento de Prompt: Slice de Gestión de Planes**

**Contexto del Proyecto**: Sistema de Gestión de Consorcios, Backend Node.js/Express, Arquitectura Vertical, Base de Datos Supabase. **Tarea**: Implementar el vertical slice "Manage Subscription Plans". **Instrucciones Técnicas**:

1. Crea una carpeta src/features/subscriptions/get-plan-limits.  
2. Implementa un endpoint GET que consulte la tabla accounts y verifique la relación con subscription\_plans.  
3. La lógica debe calcular si el administrador tiene cupo disponible para crear un nuevo consorcio basándose en la columna max\_consortia del plan activo.  
4. Usa el cliente de Supabase con RLS habilitado.  
5. Genera el contrato de API (Request/Response) en TypeScript. **Comentarios**: Asegúrate de manejar errores de "Suscripción Expirada" con un código de estado HTTP 403\.

### **Historia de Usuario 2: Configuración de Unidades Funcionales (UF)**

**Descripción**: Como Administrador, quiero cargar las unidades funcionales de un consorcio, especificando sus metros cuadrados, coeficientes y datos físicos, para poder liquidar expensas correctamente. **Criterios de Aceptación**:

* Carga de piso, departamento y descripción.  
* Asignación de coeficientes decimales de hasta 6 cifras.  
* Relación de uno a muchos entre UF y Propietarios con porcentajes de titularidad.

#### **Documento de Prompt: Slice de Configuración de UF**

**Contexto del Proyecto**: Frontend React, CoreUI Template, Arquitectura Vertical. **Tarea**: Crear el componente de gestión de Unidades Funcionales dentro de src/features/consortium-setup/components/UFManager. **Instrucciones Técnicas**:

1. Utiliza CTable de CoreUI para mostrar el listado de UF.  
2. Implementa un modal CModal para la carga y edición de datos de la UF (m2, piso, depto, coeficiente\_a, coeficiente\_d).  
3. Crea un hook personalizado useFunctionalUnits para gestionar las llamadas a la API mediante la capa de servicios.  
4. Asegúrate de incluir validaciones para que la suma de coeficientes del consorcio no sea superior a 100% (o el valor de cierre configurado). **Referencia de Estilo**: Sigue el estándar de formularios de CoreUI.

### **Historia de Usuario 3: Liquidación Masiva de Expensas**

**Descripción**: Como Administrador, deseo planificar y generar la liquidación mensual de expensas comunes y extraordinarias para que los propietarios reciban su estado de cuenta. **Criterios de Aceptación**:

* Carga de egresos categorizados.  
* Cálculo automático por UF basado en coeficientes.  
* Inclusión de saldos deudores del mes anterior más intereses.

#### **Documento de Prompt: Slice de Generación de Liquidación**

**Contexto del Proyecto**: Backend Node.js, Lógica Contable de Argentina. **Tarea**: Desarrollar el slice generate-monthly-billing. **Instrucciones Técnicas**:

1. El endpoint POST /api/billing/generate debe recibir consortium\_id y period\_id.  
2. Flujo: a. Obtener todos los gastos (expenses) del consorcio para el período. b. Obtener el listado de UF y sus saldos anteriores. c. Calcular el gasto por UF: (Gastos\_A \* Coef\_A) \+ (Gastos\_D \* Coef\_D). d. Calcular intereses punitorios para UF con saldo vencido utilizando la tasa configurada en el consorcio. e. Guardar el resultado en la tabla billing\_periods y generar los registros individuales en uf\_accounts.  
3. Implementa una transacción de base de datos para asegurar que no haya liquidaciones parciales en caso de fallo. **Citas de Lógica**: Aplicar el criterio de proporcionalidad de e intereses de.

### **Historia de Usuario 4: Portal del Propietario y Plan de Pago**

**Descripción**: Como Propietario, quiero ver el detalle de mis expensas y mi deuda actual, y tener la opción de solicitar un plan de pago si tengo deuda acumulada. **Criterios de Aceptación**:

* Visualización de saldo consolidado.  
* Acceso al histórico de liquidaciones.  
* Simulador de cuotas para planes de pago con intereses de financiación.

#### **Documento de Prompt: Slice de Portal del Propietario**

**Contexto del Proyecto**: Frontend React, Perfil Propietario. **Tarea**: Implementar el dashboard de propietario en src/features/owner-dashboard. **Instrucciones Técnicas**:

1. Usa CCard y CWidgetStats para mostrar el "Saldo Total Adeudado".  
2. Implementa una sección de "Mis Unidades" donde se listen las UF del dueño (considerando la titularidad compartida).  
3. Crea una interfaz para proponer un plan de pago: el usuario selecciona la cantidad de cuotas y el sistema estima el valor de cada una basándose en una tasa de interés configurable.  
4. Al enviar la solicitud, crear un registro en la tabla payment\_plan\_requests con estado "Pendiente de Aprobación".

### **Historia de Usuario 5: Reporte de Pago Asistido por IA (OCR)**

**Descripción**: Como Propietario, quiero informar un pago realizado mediante transferencia subiendo el comprobante para que el sistema lo valide automáticamente con IA. **Criterios de Aceptación**:

* Carga de imagen/PDF.  
* Análisis en tiempo real con IA para extraer datos de la transferencia.  
* Confirmación de los datos extraídos por parte del usuario antes del envío final.

#### **Documento de Prompt: Slice de Validación IA de Pagos**

**Contexto del Proyecto**: Integración Firebase AI Logic (Gemini). **Tarea**: Desarrollar el slice report-payment-ai. **Instrucciones Técnicas**:

1. En el frontend, crea un componente de carga de archivos CFormInput type="file".  
2. Envía el archivo al backend. El backend debe invocar a Gemini Pro Vision.  
3. Proporciona el siguiente System Instruction: "Actúa como un experto contable. Analiza el comprobante de transferencia y devuelve un JSON con: monto (number), fecha (ISO string), banco\_emisor (string), transaccion\_id (string)".  
4. Valida los datos devueltos contra el saldo de la UF del propietario.  
5. Devuelve al frontend el JSON para que el propietario confirme: "Hemos detectado un pago de $X el día Y, ¿es correcto?".  
6. Al confirmar, guarda el pago en transactions con un flag ai\_validated: true. **Citas de Referencia**: Uso de OCR para prevención de fraude según.