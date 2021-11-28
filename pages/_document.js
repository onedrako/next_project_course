import Document from "next/document"
import { ServerStyleSheet } from "styled-components"

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet() // Permite crear una hoja de estilo pero del lado del servidor
    const originalRenderPage = ctx.renderPage  //con esta se renderizán las paginas, metodo para que renderize

    try {   
      ctx.renderPage = () =>  //asignar nuevo comportamiento a render page
        originalRenderPage({
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />)   //recibe el componente app y las propiedades, intentna buscar todos lo estilos que se cneutren en la aplicaciones, en en app y recibe todas las props 
        })  //collectStyles funciona con la API de context, obtiene los estilos de todos los componentes y los guarda temporalmente en sheet
        //recolecta y guarda  

      const initialProps = await Document.getInitialProps(ctx)  //obtiene las propiedades iniciales de la pagina, recibe contexto
      
      return {    //Al final devuelve las propiedades iniciales,. dentro de getInitialProps, y agrega la propiedad styles
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()} 
          </>
        ) //Aqui se agregan los estilos en el render del servidor
      } 
    } finally {
      sheet.seal()
    } 
  }

}
