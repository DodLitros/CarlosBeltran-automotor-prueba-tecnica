# Historial de desarrollo con IA

## Planeación

**Primeros pasos**

---

1. **Entender el problema**: Lo primero y más importante fue leer con atención la prueba técnica para empezar a plantear una estrategia clara del desarrollo de esta misma. Primeramente, a lapiz y papel, plasmé el cómo quería que se viese la página y cómo una persona que está acostumbrada a Excel podría interpretar la información, es por eso que decidí hacer dos tablas, una donde se visualizaran todos sus clientes, y otra de las pólizas próximas a vencer

---

2. **Diseñar el mejor prompt inicial**: Para esto he usado chatgpt con el fin de encontrar la mejor estructura para un proyecto como este, teniendo en cuenta sus recomendaciones, empecé a escribir el prompt para pasarselo a un agente de terminal, en este caso Opencode; a sabiendas de que éste podía acceder a todo el repositorio, y a partir de un prompt con especificaciones claras, construir desde 0 el código y la arquitectura del proyecto. [historial ChatGPT](https://chatgpt.com/share/6a2328e5-4d70-83e9-879a-15891607bc83)
Hay que tener en cuenta que este chat tiene memoria, y llegó a confundir diferentes proyectos con esta prueba técnica. Acá nombra el uso de whatsapp para mensajes automáticos, y aunque es una buena idea, implementarlo es complejo, dado que para completar este feature, debo estar registrado como proveedor de tecnologías en facebook for developers.

---

3. **Prompt inicial**: Habiendo creado el directorio, me dirigí a la terminal, para que Opencode tuviera acceso a este directorio. Normalmente uso el comando ```opencode web``` dado que éste se parece más a los GPTs clásicos, y es más fácil de entender visualmente, que en la terminal. y le pasé el prompt inicial. El primer prompt traté de especificar todo teniendo en cuenta lo escrito a mano, y con las recomendaciones de chatGPT para estructurar bien el proyecto. Decidí empezar con el agente BUILD, pues a veces al planear primero, y ejecutar después, algunas tareas se ven menospreciadas, y se saltan algunas tareas cuando se decide decir que implemente el plan. En esta sesión manejé toda la implementación y correcciones a la ia [Historial Opencode](https://opncd.ai/share/7twkD9h1) En este link, se puede visualizar todas las instrucciones dadas a la IA. En este caso Qwen3.7 Max dado que desde mi experiencia, éste es el modelo que mejor implementa integraciones externas, y está dentro del módico plan de OpenCode Go (Este plan se caracteriza por contar con los mejores modelos de bajo costo, con la intención de ahorrar tokens)

---

## Errores en la implementación

Es necesario aclarar que este proyecto se pudo haber hecho con menos prompt. Uno de mis grandes errores, fue no haber preparado adecuadamente el MCP de supabase que se conectaría a mi proyecto, así que al comienzo implementó los cambios en otro proyecto que tengo alojado en supabase. La corrección de esta implementación me trajo un retrazo puesto que tená que arreglar y dejar todo claro en mi otro proyecto. 