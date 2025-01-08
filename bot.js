// Importando bibliotecas necessárias
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const moment = require('moment-timezone');

// Configuração do cliente WhatsApp
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
    }
});

// Sistema de configuração dos atendentes
const atendentes = {
    vitor: {
        nome: 'Vitor',
        numero: '557999590758',
        horarioInicio: 13,
        horarioFim: 19
    },
    mateus: {
        nome: 'Matheus',
        numero: '',//557998071366
        horarioInicio: 6,
        horarioFim: 12
    }
};

// Eventos de inicialização do bot
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Bot PaebitStore está online! 🦜');
    Object.values(atendentes).forEach(async (atendente) => {
        await client.sendMessage(`${atendente.numero}@c.us`,
            '🦜 Bot PaebitStore iniciado e pronto para atendimento!');
    });
});

// Objeto para armazenar dados do pedido
const orderData = {};

// Funções de utilidade
function isDentroHorarioAtendimento() {
    const hora = moment().tz('America/Sao_Paulo').hour();
    return hora >= 6 && hora < 19;
}

function getAtendenteDisponivel() {
    const hora = moment().tz('America/Sao_Paulo').hour();

    for (const atendente of Object.values(atendentes)) {
        if (hora >= atendente.horarioInicio && hora < atendente.horarioFim) {
            return atendente;
        }
    }
    return null;
}

function getSaudacao() {
    const hora = moment().tz('America/Sao_Paulo').hour();
    if (hora >= 5 && hora < 12) return "Bom dia";
    if (hora >= 12 && hora < 18) return "Boa tarde";
    return "Boa noite";
}

// Menus e estruturas de dados do catálogo
const menuPrincipal = `
🏪 *MENU PAEBITSTORE* 🦜

Escolha o tipo de produto:
1 - Boné
2 - Camisa
3 - Bermuda
4 - Short
5 - Calça
6 - Cueca
7 - Carteira
8 - Meia
9 - Sandália

Digite o número da opção desejada.`;

const menuPagamento = `
💳 *FORMAS DE PAGAMENTO* 💰

Escolha como deseja pagar:
1 - Dinheiro
2 - PIX
3 - Débito
4 - Crédito 1x
5 - Crédito 2x
6 - Crédito 3x
7 - Crédito 4x
8 - Crédito 5x
9 - Crédito 6x

Digite o número da opção desejada.`;

const menuCamisa = `
👕 *TIPOS DE CAMISA* 

Escolha o modelo:
1 - Camisa Básica
2 - Camisa Malhão
3 - Camisa Polo
4 - Regata

Digite o número da opção desejada.`;

const menuBermuda = `
👖 *TIPOS DE BERMUDA* 

Escolha o modelo:
1 - Bermuda Jeans
2 - Bermuda Sport Fino

Digite o número da opção desejada.`;

const menuShort = `
🩳 *TIPOS DE SHORT* 

Escolha o modelo:
1 - Short Linho e Sarja
2 - Short Tactel Hurley
3 - Short Impermeável

Digite o número da opção desejada.`;

const menuCalca = `
👖 *TIPOS DE CALÇA* 

Escolha o modelo:
1 - Calça Premium
2 - Calça Sport Fino

Digite o número da opção desejada.`;

// Mapeamento de submenus
const submenus = {
    '2': menuCamisa,    // Camisa
    '3': menuBermuda,   // Bermuda
    '4': menuShort,     // Short
    '5': menuCalca      // Calça
};

// Mapeamento de catálogos
const catalogos = {
    // Produtos sem subcategorias
    'bone': 'bit.ly/catalogopaebitstore',
    'cueca': 'bit.ly/catalogopaebitstore',
    'carteira': 'bit.ly/catalogopaebitstore',
    'meia': 'bit.ly/catalogopaebitstore',
    'sandalia': 'bit.ly/catalogopaebitstore',

    // Camisas
    'camisa_basica': 'bit.ly/catalogopaebitstore',
    'camisa_malhao': 'bit.ly/catalogopaebitstore',
    'camisa_polo': 'bit.ly/catalogopaebitstore',
    'regata': 'bit.ly/catalogopaebitstore',

    // Bermudas
    'bermuda_jeans': 'bit.ly/catalogopaebitstore',
    'bermuda_sport_fino': 'bit.ly/catalogopaebitstore',

    // Shorts
    'short_linho_sarja': 'bit.ly/catalogopaebitstore',
    'short_tactel': 'bit.ly/catalogopaebitstore',
    'short_impermeavel': 'bit.ly/catalogopaebitstore',

    // Calças
    'calca_premium': 'bit.ly/catalogopaebitstore',
    'calca_sport_fino': 'bit.ly/catalogopaebitstore'
};

const formasPagamento = {
    '1': 'Dinheiro',
    '2': 'PIX',
    '3': 'Débito',
    '4': 'Crédito 1x',
    '5': 'Crédito 2x',
    '6': 'Crédito 3x',
    '7': 'Crédito 4x',
    '8': 'Crédito 5x',
    '9': 'Crédito 6x'
};

// Mapeamento de subcategorias
const subcategorias = {
    // Camisas
    '2': {
        '1': { nome: 'Camisa Básica', catalogo: 'camisa_basica' },
        '2': { nome: 'Camisa Malhão', catalogo: 'camisa_malhao' },
        '3': { nome: 'Camisa Polo', catalogo: 'camisa_polo' },
        '4': { nome: 'Regata', catalogo: 'regata' }
    },
    // Bermudas
    '3': {
        '1': { nome: 'Bermuda Jeans', catalogo: 'bermuda_jeans' },
        '2': { nome: 'Bermuda Sport Fino', catalogo: 'bermuda_sport_fino' }
    },
    // Shorts
    '4': {
        '1': { nome: 'Short Linho e Sarja', catalogo: 'short_linho_sarja' },
        '2': { nome: 'Short Tactel Hurley', catalogo: 'short_tactel' },
        '3': { nome: 'Short Impermeável', catalogo: 'short_impermeavel' }
    },
    // Calças
    '5': {
        '1': { nome: 'Calça Premium', catalogo: 'calca_premium' },
        '2': { nome: 'Calça Sport Fino', catalogo: 'calca_sport_fino' }
    }
};

// Categorias sem submenu
const categoriasSimples = {
    '1': { nome: 'Boné', catalogo: 'bone' },
    '6': { nome: 'Cueca', catalogo: 'cueca' },
    '7': { nome: 'Carteira', catalogo: 'carteira' },
    '8': { nome: 'Meia', catalogo: 'meia' },
    '9': { nome: 'Sandália', catalogo: 'sandalia' }
};

// Funções auxiliares
// Nova função de coleta de dados pessoais sequencial
async function coletarDadosPessoais(msg) {
    const chat = await msg.getChat();
    await chat.sendStateTyping();

    orderData[msg.from] = orderData[msg.from] || {};
    const estado = orderData[msg.from].estadoDadosPessoais || 0;

    const perguntas = [
        "Por favor, me informe seu nome completo:",
        "Ótimo! Agora, qual é o seu número de telefone para contato?",
        "Perfeito! Por último, qual é o seu email?"
    ];

    if (!orderData[msg.from].dadosPessoais) {
        orderData[msg.from].dadosPessoais = {};
    }

    switch (estado) {
        case 0:
            orderData[msg.from].dadosPessoais.nome = msg.body;
            await client.sendMessage(msg.from, perguntas[1]);
            orderData[msg.from].estadoDadosPessoais = 1;
            return "AGUARDANDO_DADOS_PESSOAIS";

        case 1:
            orderData[msg.from].dadosPessoais.telefone = msg.body;
            await client.sendMessage(msg.from, perguntas[2]);
            orderData[msg.from].estadoDadosPessoais = 2;
            return "AGUARDANDO_DADOS_PESSOAIS";

        case 2:
            orderData[msg.from].dadosPessoais.email = msg.body;
            await client.sendMessage(msg.from, "Excelente! Agora preciso saber o endereço de entrega.\n\nQual o tipo de entrega?\n1 - Casa\n2 - Apartamento");
            delete orderData[msg.from].estadoDadosPessoais;
            return "ESCOLHA_TIPO_ENTREGA";

        default:
            await client.sendMessage(msg.from, perguntas[0]);
            orderData[msg.from].estadoDadosPessoais = 0;
            return "AGUARDANDO_DADOS_PESSOAIS";
    }
}

// Nova função de coleta de dados de casa sequencial
async function coletarDadosCasa(msg) {
    const chat = await msg.getChat();
    await chat.sendStateTyping();

    orderData[msg.from] = orderData[msg.from] || {};
    const estado = orderData[msg.from].estadoDadosCasa || 0;

    const perguntas = [
        "Qual o nome da sua rua ou avenida?",
        "Qual o número da casa?",
        "Qual o CEP?",
        "Por favor, informe um ponto de referência:"
    ];

    if (!orderData[msg.from].endereco) {
        orderData[msg.from].endereco = { tipo: 'casa' };
    }

    switch (estado) {
        case 0:
            orderData[msg.from].endereco.rua = msg.body;
            await client.sendMessage(msg.from, perguntas[1]);
            orderData[msg.from].estadoDadosCasa = 1;
            return "AGUARDANDO_DADOS_CASA";

        case 1:
            orderData[msg.from].endereco.numero = msg.body;
            await client.sendMessage(msg.from, perguntas[2]);
            orderData[msg.from].estadoDadosCasa = 2;
            return "AGUARDANDO_DADOS_CASA";

        case 2:
            orderData[msg.from].endereco.cep = msg.body;
            await client.sendMessage(msg.from, perguntas[3]);
            orderData[msg.from].estadoDadosCasa = 3;
            return "AGUARDANDO_DADOS_CASA";

        case 3:
            orderData[msg.from].endereco.referencia = msg.body;
            await client.sendMessage(msg.from, `${menuPagamento}`);
            delete orderData[msg.from].estadoDadosCasa;
            return "AGUARDANDO_FORMA_PAGAMENTO";

        default:
            await client.sendMessage(msg.from, perguntas[0]);
            orderData[msg.from].estadoDadosCasa = 0;
            return "AGUARDANDO_DADOS_CASA";
    }
}

// Nova função de coleta de dados de apartamento sequencial
async function coletarDadosApartamento(msg) {
    const chat = await msg.getChat();
    await chat.sendStateTyping();

    orderData[msg.from] = orderData[msg.from] || {};
    const estado = orderData[msg.from].estadoDadosApt || 0;

    const perguntas = [
        "Qual o nome da rua ou avenida?",
        "Qual o número do condomínio?",
        "Qual o nome do condomínio?",
        "Qual o bloco do seu apartamento?",
        "Qual o número do seu apartamento?",
        "Por último, qual o CEP?"
    ];

    if (!orderData[msg.from].endereco) {
        orderData[msg.from].endereco = { tipo: 'apartamento' };
    }

    switch (estado) {
        case 0:
            orderData[msg.from].endereco.rua = msg.body;
            await client.sendMessage(msg.from, perguntas[1]);
            orderData[msg.from].estadoDadosApt = 1;
            return "AGUARDANDO_DADOS_APARTAMENTO";

        case 1:
            orderData[msg.from].endereco.numeroCondominio = msg.body;
            await client.sendMessage(msg.from, perguntas[2]);
            orderData[msg.from].estadoDadosApt = 2;
            return "AGUARDANDO_DADOS_APARTAMENTO";

        case 2:
            orderData[msg.from].endereco.nomeCondominio = msg.body;
            await client.sendMessage(msg.from, perguntas[3]);
            orderData[msg.from].estadoDadosApt = 3;
            return "AGUARDANDO_DADOS_APARTAMENTO";

        case 3:
            orderData[msg.from].endereco.bloco = msg.body;
            await client.sendMessage(msg.from, perguntas[4]);
            orderData[msg.from].estadoDadosApt = 4;
            return "AGUARDANDO_DADOS_APARTAMENTO";

        case 4:
            orderData[msg.from].endereco.apartamento = msg.body;
            await client.sendMessage(msg.from, perguntas[5]);
            orderData[msg.from].estadoDadosApt = 5;
            return "AGUARDANDO_DADOS_APARTAMENTO";

        case 5:
            orderData[msg.from].endereco.cep = msg.body;
            await client.sendMessage(msg.from, `${menuPagamento}`);
            // await client.sendMessage(msg.from, msg, menuPagamento);
            delete orderData[msg.from].estadoDadosApt;
            return "AGUARDANDO_FORMA_PAGAMENTO";

        default:
            await client.sendMessage(msg.from, perguntas[0]);
            orderData[msg.from].estadoDadosApt = 0;
            return "AGUARDANDO_DADOS_APARTAMENTO";
    }
}

function gerarResumo(userId) {
    const dados = orderData[userId];
    const horaAtual = moment().tz('America/Sao_Paulo').format('DD/MM/YYYY HH:mm:ss');

    let resumo = "📋 *RESUMO DO PEDIDO*\n\n";

    // Data e hora
    resumo += "*Data e Hora:* " + horaAtual + "\n\n";

    // Dados do cliente
    resumo += "*DADOS DO CLIENTE*\n";
    resumo += "Nome: " + dados.dadosPessoais.nome + "\n";
    resumo += "Telefone: " + dados.dadosPessoais.telefone + "\n";
    resumo += "Email: " + dados.dadosPessoais.email + "\n\n";

    // Dados do produto
    resumo += "*PRODUTO SELECIONADO*\n";
    resumo += dados.produto + "\n\n";

    // Forma de pagamento
    resumo += "*FORMA DE PAGAMENTO*\n";
    resumo += dados.formaPagamento + "\n\n";

    // Dados do endereço
    resumo += "*ENDEREÇO DE ENTREGA*\n";
    if (dados.endereco.tipo === 'casa') {
        resumo += "Tipo: Casa\n";
        resumo += "Rua: " + dados.endereco.rua + "\n";
        resumo += "Número: " + dados.endereco.numero + "\n";
        resumo += "CEP: " + dados.endereco.cep + "\n";
        resumo += "Ponto de Referência: " + dados.endereco.referencia;
    } else {
        resumo += "Tipo: Apartamento\n";
        resumo += "Rua: " + dados.endereco.rua + "\n";
        resumo += "Número do Condomínio: " + dados.endereco.numeroCondominio + "\n";
        resumo += "Nome do Condomínio: " + dados.endereco.nomeCondominio + "\n";
        resumo += "Bloco: " + dados.endereco.bloco + "\n";
        resumo += "Apartamento: " + dados.endereco.apartamento + "\n";
        resumo += "CEP: " + dados.endereco.cep;
    }

    return resumo;
}

// Função para encaminhar pedido para atendentes
async function encaminharParaAtendente(msg, resumoPedido) {
    const atendente = getAtendenteDisponivel();

    if (atendente) {
        await client.sendMessage(msg.from, `Ótimo! Seu pedido foi registrado com sucesso! 🦜\n\n` +
            `${atendente.nome} já vai assumir seu atendimento para finalizar sua compra. ` +
            `Aguarde um momento, por favor! 😊`);

        await client.sendMessage(`${atendente.numero}@c.us`,
            `‼️ Novo pedido recebido ‼️\n\n${resumoPedido}`);

        const outrosAtendentes = Object.values(atendentes)
            .filter(a => a.numero !== atendente.numero);

        for (const outro of outrosAtendentes) {
            await client.sendMessage(`${outro.numero}@c.us`,
                `ℹ️ Novo pedido recebido (para acompanhamento) ℹ️\n\n` +
                `Atendente principal: ${atendente.nome}\n${resumoPedido}`);
        }
    } else {
        await client.sendMessage(msg.from, `Recebemos seu pedido! 🦜\n\n` +
            `Nosso horário de atendimento é das 8h às 22h. ` +
            `Retornaremos seu contato assim que estivermos disponíveis!\n\n` +
            `Agradecemos sua preferência! 🙏`);

        for (const atendente of Object.values(atendentes)) {
            await client.sendMessage(`${atendente.numero}@c.us`,
                `⚠️ Pedido recebido fora do horário ⚠️\n\n${resumoPedido}`);
        }
    }
}

// Manipulador principal de mensagens
client.on('message', async msg => {
    const chat = await msg.getChat();
    await chat.sendStateTyping();

    orderData[msg.from] = orderData[msg.from] || { estado: 'INICIAL' };
    const estado = orderData[msg.from].estado;

    switch (estado) {
        case 'INICIAL':
            const saudacao = getSaudacao();
            await client.sendMessage(msg.from, `${saudacao}! 🦜 Bem-vindo à PaebitStore!\n\n${menuPrincipal}`);
            orderData[msg.from].estado = 'AGUARDANDO_ESCOLHA_CATEGORIA';
            break;

        case 'AGUARDANDO_ESCOLHA_CATEGORIA':

            if (submenus[msg.body]) {
                orderData[msg.from].categoriaEscolhida = msg.body;
                await client.sendMessage(msg.from, submenus[msg.body]);
                orderData[msg.from].estado = 'AGUARDANDO_ESCOLHA_SUBCATEGORIA';
            }

            else if (categoriasSimples[msg.body]) {
                const categoria = categoriasSimples[msg.body];
                await client.sendMessage(msg.from, `Ótima escolha! Aqui está nosso catálogo de ${categoria.nome}: ${catalogos[categoria.catalogo]}`);
                await client.sendMessage(msg.from, "Após escolher o produto, por favor, envie o link ou uma foto do item desejado.");
                orderData[msg.from].estado = 'AGUARDANDO_CONFIRMACAO_PRODUTO';
            }
            else {
                await client.sendMessage(msg.from, "Por favor, escolha uma opção válida do menu principal.");
            }
            break;

        case 'AGUARDANDO_ESCOLHA_SUBCATEGORIA':
            const categoriaAtual = orderData[msg.from].categoriaEscolhida;
            const subcategoriasDisponiveis = subcategorias[categoriaAtual];

            if (subcategoriasDisponiveis && subcategoriasDisponiveis[msg.body]) {
                const subcategoria = subcategoriasDisponiveis[msg.body];
                await client.sendMessage(msg.from, `Ótima escolha! Aqui está nosso catálogo de ${subcategoria.nome}: ${catalogos[subcategoria.catalogo]}`);
                await client.sendMessage(msg.from, "Após escolher o produto, por favor, envie o link ou uma foto do item desejado.");
                orderData[msg.from].estado = 'AGUARDANDO_CONFIRMACAO_PRODUTO';
            } else {
                await client.sendMessage(msg.from, "Por favor, escolha uma opção válida do submenu.");
            }
            break;

        case 'AGUARDANDO_CONFIRMACAO_PRODUTO':
            orderData[msg.from].produto = msg.body;
            await client.sendMessage(msg.from, "Produto selecionado! Nossa entrega é GRÁTIS! 🚚✨\n\n" +
                "Agora vou precisar de alguns dados seus para finalizar o pedido.");
            await client.sendMessage(msg.from, "Por favor, me informe seu nome completo:");
            orderData[msg.from].estado = 'AGUARDANDO_DADOS_PESSOAIS';
            break;

        case 'AGUARDANDO_DADOS_PESSOAIS':
            orderData[msg.from].estado = await coletarDadosPessoais(msg);
            break;

        case 'ESCOLHA_TIPO_ENTREGA':
            if (msg.body === '1') {
                await client.sendMessage(msg.from, "Qual o nome da sua rua ou avenida?");
                orderData[msg.from].estado = 'AGUARDANDO_DADOS_CASA';
                orderData[msg.from].estadoDadosCasa = 0;
            } else if (msg.body === '2') {
                await client.sendMessage(msg.from, "Qual o nome da rua ou avenida?");
                orderData[msg.from].estado = 'AGUARDANDO_DADOS_APARTAMENTO';
                orderData[msg.from].estadoDadosApt = 0;
            } else {
                await client.sendMessage(msg.from, "Por favor, escolha 1 para Casa ou 2 para Apartamento.");
            }
            break;

        case 'AGUARDANDO_DADOS_CASA':
            orderData[msg.from].estado = await coletarDadosCasa(msg);
            break;

        case 'AGUARDANDO_DADOS_APARTAMENTO':
            orderData[msg.from].estado = await coletarDadosApartamento(msg);
            break;

        case 'AGUARDANDO_FORMA_PAGAMENTO':
            if (msg.body >= '1' && msg.body <= '9') {
                orderData[msg.from].formaPagamento = formasPagamento[msg.body];
                const resumoPedido = gerarResumo(msg.from);
                await encaminharParaAtendente(msg, resumoPedido);
                orderData[msg.from].estado = 'FINALIZADO';
            } else {
                await reply(msg, "Por favor, escolha uma forma de pagamento válida:\n" + menuPagamento);
            }
            break;

        // case 'FINALIZADO':
        //     await client.sendMessage(msg.from, "Seu pedido já foi encaminhado para nossos atendentes. Aguarde o contato! 😊");
        //     orderData[msg.from] = { estado: 'INICIAL' };
        //     break;
        case 'FINALIZADO':
            if (['categoria', 'outra', 'outro',].includes(msg.body.toLowerCase())) {
                await client.sendMessage(msg.from, "Vamos começar novamente! 🦜\n\n" + menuPrincipal);
                orderData[msg.from] = { estado: 'AGUARDANDO_ESCOLHA_CATEGORIA' };
            } else {
                await client.sendMessage(msg.from, "Seu pedido já foi encaminhado para nossos atendentes. Aguarde o contato! 😊");
            }
            break;


        default:
            await client.sendMessage(msg.from, "Desculpe, não entendi. Vamos recomeçar?\n\n" + menuPrincipal);
            orderData[msg.from] = { estado: 'INICIAL' };
            break;
    }
});

// Iniciar o bot
client.initialize();

//Ex: Seleção de mensagem "await msg.reply( perguntas[1]);" , sem seleção "await client.sendMessage(msg.from, perguntas[1]);"