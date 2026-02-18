# **Especificación Técnica y Funcional del Sistema Integral de Gestión de Consorcios: Arquitectura Vertical, Persistencia en Supabase e Integración de Inteligencia Artificial**

## **Fundamentos Legales y el Modelo Contable de la Propiedad Horizontal**

La base de cualquier sistema de gestión de consorcios debe ser el cumplimiento estricto del Artículo 2048 del Código Civil y Comercial, el cual establece la obligatoriedad del pago de expensas comunes ordinarias y extraordinarias. Las expensas ordinarias se definen como los gastos recurrentes necesarios para la administración, reparación y conservación de las partes comunes, incluyendo los salarios del personal de edificios (SUTERH), abonos de servicios y honorarios profesionales. Por otro lado, las expensas extraordinarias son aquellas erogaciones excepcionales decididas en asamblea, orientadas a mejoras de valor o reparaciones estructurales de gran envergadura.  
El sistema debe manejar con precisión el concepto de coeficiente de copropiedad. Este valor, determinado en el Reglamento de Propiedad Horizontal, define la proporción de participación de cada unidad funcional (UF) en los gastos del consorcio. El cálculo de la cuota de administración para cada propietario resulta de aplicar este coeficiente al total de gastos liquidados en el período. Es imperativo que el sistema permita la gestión de coeficientes diferenciados por rubros, dado que una unidad funcional puede participar de los gastos generales (Tipo A) pero estar exenta o tener una participación distinta en gastos de cocheras (Tipo D) o sectores específicos del edificio (Tipo B).

| Rubro de Gasto | Descripción Técnica | Coeficiente Aplicable | Impacto Contable |
| :---- | :---- | :---- | :---- |
| Gastos Comunes (A) | Sueldos, cargas sociales, servicios básicos, mantenimiento de ascensores. | Principal de la UF | Ordinario |
| Gastos Sectoriales (B/C) | Mantenimiento de áreas de uso restringido o locales comerciales. | Específico por Sector | Ordinario |
| Gastos de Cochera (D) | Portones automáticos, iluminación de subsuelo, limpieza de garaje. | Coeficiente de Cochera | Ordinario |
| Gastos Particulares (E) | Reparaciones dentro de la unidad a cargo del consorcio o multas. | Directo a la UF | Variable |
| Fondos de Reserva | Ahorro para contingencias o futuros gastos previstos por asamblea. | Principal o Fijo | Extraordinario |

La liquidación de expensas en el entorno argentino debe seguir el formato de "Mis Expensas", que exige un desglose minucioso de ingresos y egresos, conciliación bancaria y detalle de deudas con sus respectivos intereses punitorios. El sistema debe automatizar el cálculo de estos intereses, que generalmente se sitúan entre el 2% y el 4% mensual de acuerdo con lo estipulado en cada reglamento, aplicándose a partir del vencimiento de la cuota.

## **Arquitectura de Software: El Paradigma de Vertical Slices**

Para garantizar una base de código mantenible y resistente al paso del tiempo, se ha seleccionado la Arquitectura Vertical (Vertical Slice Architecture). A diferencia de las arquitecturas tradicionales por capas (como la arquitectura en N-tier o Clean Architecture), donde el código se organiza por su rol técnico (controladores, servicios, repositorios), la arquitectura vertical organiza el sistema en torno a características de negocio o casos de uso.

### **Ventajas de la Arquitectura Vertical en Sistemas de Gestión**

La implementación de Vertical Slices permite que cada funcionalidad —como "Generar Liquidación" o "Registrar Pago"— sea tratada como una unidad independiente que atraviesa todas las capas tecnológicas. Esto maximiza la cohesión interna de la funcionalidad y reduce drásticamente el acoplamiento entre módulos no relacionados, evitando que los cambios en una parte del sistema provoquen efectos secundarios inesperados en otras.

En el frontend, React adoptará este mismo patrón mediante una estructura de carpetas basada en features/. Cada feature contendrá sus propios componentes, hooks, servicios de API y lógica de estado, dejando el directorio shared/ únicamente para elementos transversales como el diseño base del template CoreUI o utilidades generales.

## **Especificación Técnica del Backend: Node.js, Express y Supabase**

El backend se construirá como una API robusta que expone servicios para el frontend y otras posibles integraciones. Se utilizará Node.js con TypeScript para asegurar la tipificación de los datos y prevenir errores en tiempo de ejecución. La arquitectura vertical se implementará siguiendo el patrón REPR (Request-EndPoint-Response), donde cada endpoint es responsable de gestionar su propia lógica.

### **Persistencia y Multi-tenancy con Supabase**

Supabase servirá como el corazón de los datos, proporcionando una base de datos PostgreSQL con capacidades de tiempo real y autenticación integrada. El modelo de multi-tenancy es fundamental: cada Administrador gestiona una "Cuenta" que puede contener múltiples "Consorcios". Esta jerarquía se protegerá mediante el uso intensivo de Row Level Security (RLS) en Supabase, asegurando que un usuario solo pueda acceder a los datos que le corresponden según su rol y pertenencia.

| Entidad | Descripción Técnica | Relaciones Clave |
| :---- | :---- | :---- |
| Account | Entidad de facturación y límites del plan. | 1:N con Consorcios |
| Consortium | Datos legales, fiscales y configuración del edificio. | N:1 con Account, 1:N con UF |
| Functional Unit (UF) | Unidad de vivienda/comercio con sus coeficientes. | N:1 con Consortium, N:M con Owners |
| Owner | Datos de contacto y acceso de los propietarios. | N:M con UF |
| Transaction | Registro de movimientos de caja (ingresos/egresos). | N:1 con Consortium |
| ExpensePlan | Planificación y liquidación mensual de expensas. | N:1 con Consortium |

La lógica de negocios se delegará a UseCases específicos dentro de cada slice. Por ejemplo, el slice de accounting/record-payment no solo guardará un registro en la base de datos, sino que también disparará la actualización del saldo de la unidad funcional y generará una notificación para el propietario. El acceso a la base de datos se realizará preferentemente a través de un cliente singleton de Supabase o Prisma ORM, manteniendo el principio de inyección de dependencias para facilitar el intercambio por mocks durante las pruebas unitarias.

## **Especificación Técnica del Frontend: React y CoreUI**

El frontend se desarrollará con React, priorizando la usabilidad y la experiencia de usuario profesional mediante el template **CoreUI for React**. Este framework proporciona una base sólida de componentes accesibles y responsivos, alineados con las necesidades de un panel administrativo complejo.

### **Estructura de la Interfaz y Usabilidad**

Se seguirá el esquema de diseño proporcionado por CoreUI, utilizando el sistema de grillas (Grid System) para adaptar la visualización de datos financieros tanto en computadoras de escritorio como en dispositivos móviles. La navegación se organizará mediante un CSidebar dinámico que cambiará según el rol del usuario.

* **Administradores**: Acceso a gráficos de morosidad, gestión de múltiples consorcios, carga masiva de gastos y configuración de planes de suscripción.  
* **Propietarios**: Vista simplificada con su estado de deuda actual, acceso rápido a liquidaciones en PDF y un portal de pagos intuitivo.

La capa de servicios en el frontend actuará como un puente entre los componentes de React y la API de Node.js. Cada feature tendrá un archivo service.ts encargado de realizar las llamadas mediante fetch o axios, manejando los tokens de autenticación de Supabase de manera transparente. El uso de bibliotecas como React Query permitirá gestionar el estado de los datos de forma eficiente, ofreciendo una experiencia fluida con actualizaciones en segundo plano y gestión de caché.

## **Módulo de Inteligencia Artificial: Validación y OCR de Comprobantes**

Una de las funcionalidades más innovadoras del sistema es el procesamiento automático de comprobantes de pago mediante inteligencia artificial. Cuando un propietario informa un pago, el sistema debe analizar la imagen del comprobante de transferencia bancaria para extraer información crítica y compararla con los registros del sistema.

### **Flujo de Procesamiento IA**

El sistema utilizará las capacidades de **Firebase AI Logic** o servicios equivalentes de Gemini para realizar el reconocimiento óptico de caracteres (OCR) y el análisis semántico del documento.

1. **Ingesta**: El propietario carga una fotografía o PDF del comprobante desde la aplicación móvil o web.  
2. **Extracción**: Un agente de IA especializado procesa el documento extrayendo:  
   * Monto exacto de la operación.  
   * Fecha y hora de la transferencia.  
   * CBU/Alias de destino (para verificar que se depositó en la cuenta correcta del consorcio).  
   * Número de operación o UTR para evitar duplicados.  
3. **Validación**: El backend recibe el JSON estructurado de la IA y verifica si el monto coincide con la deuda informada. Si los datos son consistentes, el pago se marca como "Pre-aprobado" a la espera de la conciliación bancaria definitiva.  
4. **Detección de Fraude**: La IA comparará patrones de transacciones previas y analizará la autenticidad visual del documento para alertar sobre posibles alteraciones digitales.

| Campo Extraído | Tipo de Dato | Función de Validación |
| :---- | :---- | :---- |
| Amount | Decimal | Comparación con el saldo deudor de la UF. |
| Transaction ID | String | Verificación de unicidad en la base de datos para evitar re-uso de tickets. |
| Target Account | String | Match con la cuenta bancaria configurada para el consorcio. |
| Execution Date | DateTime | Determinación de si el pago entró dentro del primer o segundo vencimiento. |
| Confidence Score | Float | Umbral para decidir si se aprueba automáticamente o requiere revisión manual. |

## **Definición de Roles y Permisos (RBAC)**

El sistema implementa un control de acceso basado en roles (RBAC) que garantiza que cada usuario interactúe únicamente con las funciones permitidas por su perfil.

### **Súper Administrador**

Es el encargado de la gobernanza global del sistema. Sus funciones incluyen:

* Gestión de los planes de precios y límites de consorcios por cuenta.  
* Supervisión de métricas de uso de la plataforma.  
* Administración de usuarios globales y soporte técnico.

### **Administrador**

Es el usuario principal del sistema. Sus responsabilidades comprenden:

* Gestión de su propia cuenta y suscripción.  
* Creación y configuración de múltiples consorcios.  
* Definición de las unidades funcionales y sus propietarios.  
* Liquidación de expensas, carga de gastos y gestión de proveedores.

### **Operador**

Personal administrativo designado por el administrador con permisos granulares:

* Carga de facturas y movimientos contables diarios.  
* Actualización de datos de contacto de propietarios.  
* Emisión de notificaciones y avisos de mantenimiento.

### **Propietario**

El usuario final que consume la información del consorcio:

* Visualización de los datos de su unidad funcional.  
* Descarga de comprobantes de expensas y rendiciones de cuentas.  
* Consulta de deuda histórica y actual.  
* Informar pagos y solicitar planes de pago.

## **Comunicación y Gestión de Notificaciones**

La interacción entre la administración y los consorcistas es un punto crítico para reducir la morosidad y mejorar la convivencia. El sistema integrará un módulo de comunicaciones robusto capaz de gestionar diversos canales de notificación.

1. **Notificaciones Transaccionales**: Avisos automáticos sobre la generación de nuevas expensas, confirmación de recepción de pagos y recordatorios de vencimiento inminente.  
2. **Comunicaciones del Consorcio**: Envío de actas de asamblea, comunicados urgentes por cortes de suministro y encuestas de satisfacción o votaciones no vinculantes.  
3. **Seguimiento de Mensajería**: Un registro histórico de todas las comunicaciones enviadas, con marcas de "entregado" y "leído" para evitar disputas sobre la recepción de información legalmente relevante.

## **Plan de Implementación**


### **Fase 1: Entorno **

Se iniciará creando un espacio de trabajo. Iniciar la estructura general de los proyectos api y frontend, incluyendo los modelos de datos base y la navegación principal. Se configurará la conexión con Supabase estableciendo las variables de entorno necesarias en el workspace.

### **Fase 2: Desarrollo del Core Contable **

Se procederá al desarrollo de los slices verticales de mayor complejidad. El enfoque será iterativo: se solicitará a la IA de Firebase Studio la generación del código para la liquidación de expensas y el cálculo de coeficientes, proporcionando las reglas de negocio detalladas en los prompts. Se integrarán las reglas de IA en un archivo airules.md para que Gemini mantenga la consistencia arquitectónica en cada generación de código.

### **Fase 2: Frontend y Dashboard Administrativo**

Se implementarán las pantallas de gestión utilizando los componentes de CoreUI. La IA ayudará a mapear los servicios de API del backend con los componentes de la interfaz, asegurando que el flujo de datos sea bidireccional y eficiente. Se prestará especial atención a la visualización de datos complejos mediante tablas y gráficos.

## **Gobernanza de Datos y Seguridad**

Dada la sensibilidad de la información financiera y personal gestionada, el sistema debe adherirse a rigurosas políticas de protección de datos.

### **Seguridad a Nivel de Fila (RLS) en PostgreSQL**

La arquitectura multi-tenant se sustenta en la capacidad de Supabase de inyectar el user\_id en cada consulta SQL. Se definirán políticas que impidan que un administrador acceda a los datos de otro administrador, y que los propietarios solo vean los registros vinculados a sus IDs únicos.

### **Auditoría y Logs**

Cada movimiento contable y cada cambio en la configuración del consorcio debe dejar una huella de auditoría (audit\_log). Esto incluye quién realizó el cambio, en qué fecha y qué valores fueron modificados. Esta funcionalidad es vital para resolver disputas durante las auditorías anuales de los consorcios o ante inspecciones de organismos de control.