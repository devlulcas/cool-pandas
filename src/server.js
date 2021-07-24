//Importando módulos padrão para realizar atividades no sistema
const http = require("http");
const fs = require("fs");
const path = require("path");

//Criando servidor http e passando função myServer para processar as requisições e respostas
const server = http.createServer(myServer);
//Porta por onde o servidor irá escutar por novas requisições - hardcoded
const PORT = 2309;
//Função responsável pelo processamento de requisições e respostas
function myServer(req, res) {
  //Variáveis mutáveis que recebem o nome do arquivo html e a sua rota correspondente
  let htmlFile;
  let route;

  //Switch case que verifica a url acessada e então atribui tal url para a variável route
  switch (req.url) {
    case "/":
      route = "/";
      htmlFile = "index.html";
      break;
    case "/about":
      route = "/about";
      htmlFile = "about.html";
      break;
    case "/preserve":
      route = "/preserve";
      htmlFile = "preserve.html";
      break;
    default:
      route = "/";
      htmlFile = "index.html";
      break;
  }

  //A constante html recebe o caminho para o arquivo html requisitado
  const html = path.join(__dirname, `../public/${htmlFile}`);

  //Função responsável por entregar o conteúdo sendo chamada por si mesma
  (function deliverContent(finalHtml) {
    //Expressões regulares para checar o que cada url está requisitando
    const cssRegex = /\.css$/;
    const svgRegex = /\.svg$/;
    const jpegRegex = /\.jpeg$/;
    const jpgRegex = /\.jpg$/;

    //HTML - Caso a url seja a rota e não um outro arquivo, lemos o html e entregamos ele ao cliente com a função send
    if (req.url === route) {
      fs.readFile(finalHtml, (err, data) => send(err, data, "text/html"));
    }
    //CSS - Caso a url requisitada termine com .css usamos a função searchAndSend passando o mimeType do css para entregarmos ao cliente o arquivo
    else if (req.url.match(cssRegex)) {
      searchAndSend("text/css");
    }
    //SVG
    else if (req.url.match(svgRegex)) {
      searchAndSend("image/svg+xml");
    }
    //JPEG
    else if (req.url.match(jpegRegex)) {
      searchAndSend("image/jpeg");
    }
    //JPG
    else if (req.url.match(jpgRegex)) {
      searchAndSend("image/jpg");
    }
  })(html);

  //Função que recebe o mimeType do arquivo a ser enviado, procura o caminho do arquivo, lê o arquivo e chama a função send para enviá-lo
  function searchAndSend(mimeType) {
    //filePath usa o método path para obter o caminho para o arquivo requisitado na url
    const filePath = path.join(__dirname, "../public", req.url);
    //readFille lê os bytes do arquivo e passa para send como data
    fs.readFile(filePath, (err, data) => send(err, data, mimeType));
  }

  //Função que recebe os bytes do arquivo e seu mimeType e envia o arquivo para o cliente
  function send(err, data, mimeType) {
    //Quando houver um erro ele será mostrado no console
    if (err) console.log(err);
    else {
      //Criamos a resposta indicando que o Content-type dela é o mimeType passado como argumento
      res.setHeader("Content-Type", `${mimeType}`);
      //Colocamos o status dessa resposta como 200 OK
      res.status = 200;
      //Escrevemos na resposta os bytes obtidos pelo fs.readFile
      res.write(data);
      //Finalizamos a resposta para o cliente não ficar carregando para sempre
      res.end();
    }
  }
}

//Iniciamos o servidor com ele escutando na porta especificada lá no topo.
server.listen(PORT, () => console.log(`Listening on ${PORT}`));
