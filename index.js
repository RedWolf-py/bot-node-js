
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const comandos = require('./arquivos/comandos')
const regras = require('./arquivos/regras')
const menu = require('./arquivos/menu')
const LinksA = require('./arquivos/linksA')
const path = require('path')
const fs = require('fs');


const bot = new Client({
    authStrategy: new LocalAuth()
});

bot.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

bot.on('ready', () => {

    msgContador();
    ChatPrivado();
    ChatGrupo();
    novoUsuario();
    UserSair();
    MecionarGrupo();
    TratarLinks();
    MsgExcuida();
    //InforChatt();
    perfil();

    console.log('Bot Online!');
});

const ChatGrupo = () => {
    bot.on('message', async (msg) => {

        let chat = await msg.getChat();
        if (chat.isGroup) {

            const enviar = msg.from
            const receber = msg.body.toLocaleLowerCase().substring(0, 5).trim().split(" ").join("");


            if (receber == 'bomd' || receber == 'boan') {
                bot.sendMessage(enviar, comandos.execute());

            } else if (msg.body.toLocaleLowerCase() === '!bot') {
                bot.sendMessage(msg.from, menu.execute());


            } else if (msg.body === '!grupoinfor') {
                let chatInfor = await msg.getChat();
                if (chatInfor.isGroup) {
                    //${chat.owner.user}

                    // Descrição: ${chat.description}
                    //const contact = await msg.getContact();
                    chat.sendMessage(`
                    *Informações Do Grupo*\n
                    Name: ${chat.name}
                    Participantes: ${chat.participants.length}
                    Criado Em: ${chat.createdAt.toString()}
                    Criado Por: *@Alessandro*`
                    );
                }
            } else if (msg.body === '!meme') {
                const links = ['https://i.ibb.co/r6wRNSr/6fa83d93253b5d6e5a1a1ce70e7b9ac8.jpg'
                    , 'https://i.ibb.co/BwWqBWV/7d4a703317e8b97bed33253456a8e1bcbe66b382227ac9c253f34496d995c7ed-1.jpg'
                    , 'https://i.ibb.co/Rcrnm2p/46a9d63919e94a56124d940c5870444d.jpg'
                    , 'https://i.ibb.co/KN3zCxb/68f39035cdf501512032d55c8898ba4e.jpg'
                    , 'https://i.ibb.co/0JKxQLF/2235a2e82c363acd8e2d9b2ff53885da.jpg'
                    , 'https://i.ibb.co/MBRRG7c/160816199-735679793803696-8578379629498588181-n.jpg'
                    , 'https://i.ibb.co/VN7vZNx/acfa58982a124d90d133ba7a3b7b5c66.jpg'
                    , 'https://i.ibb.co/2WKQbK0/c14d754aa3da0af86b89995598bdbc18.jpg'
                    , 'https://i.ibb.co/QnLS6zB/charge-1.jpg'
                    , 'https://i.ibb.co/pxS2gpJ/deusleu-menor-748x410.jpg'
                    , 'https://i.ibb.co/sF3JwBh/eaac5d77fbe4fc3296c0a1700a5d951fc4935dc824d2331a6fca5558ab39b96b-1.jpg'
                    , 'https://i.ibb.co/C50JPdB/gato.jpg'
                    , 'https://i.ibb.co/Xydv7T1/meme.jpg'
                    , 'https://i.ibb.co/NV41fd7/memesdeprograma-ao1.jpg'
                    , 'https://i.ibb.co/42Rktc4/mmeme.jpg'
                    , 'https://i.ibb.co/sttcTNy/post3.jpg'
                    , 'https://i.ibb.co/TWZ6p5y/postmeme1.jpg']



                const linksrandom = Math.floor(Math.random() * links.length);
                let linksall = links[linksrandom]
                const midia = await MessageMedia.fromUrl(linksall)
                msg.reply(midia)
                //bot.sendMessage(msg.from, midia)

            } else if (msg.body === '!userinfor') {
                const contact = await msg.getContact();
                const chat = await msg.getChat();

                const inforNume = contact.number
                const nusalvo = fs.readFileSync('./nusalvo.json', 'utf-8');
                const update = JSON.parse(nusalvo)
                let chatR;

                update.forEach(el => {
                    let numeInfor = el[0]
                    let chatNinfor = el[1]

                    if (numeInfor === inforNume) {
                        chatR = chatNinfor

                    }

                });

                chat.sendMessage(`Olá @${inforNume} Tudo Bem ! Voçê Tem ${chatR}\n Participação no chat Do Grupo !`, {
                    mentions: [contact]

                })

            } else if (msg.body === '!midia') {
                msg.reply(LinksA.execute())

            } else if (msg.body === '!regras') {
                msg.reply(regras.execute())
            }
        }//if
    })//bot
}//funcao

//Chat Privado
const ChatPrivado = () => {

    bot.on('message', async (msg) => {
        let chat = await msg.getChat();
        if (!chat.isGroup) {
            msg.reply('Descupe-me! Mais não atendo no Particular, \nDúvidas manda no Grupo !');
        }
    })
}


const novoUsuario = () => {
    bot.on('group_join', (msgNovo) => {

        const novo = msgNovo.recipientIds[0]
        msgNovo.reply(`Bem Vindo(a) ${novo}`)
        setTimeout(() => {
            msgNovo.reply(menu.execute())
        }, 1000)

    })
}

const UserSair = () => {
    bot.on('group_leave', (exit) => {


        const contato = exit.recipientIds[0]

        exit.reply(`Já Vai Tarde ${contato} \n Saiu...! Mas saiu mais inteligente do que entrou !`, {
            recipientIds: [contato]

        });

    });
}
const MecionarGrupo = () => {
    bot.on('message', async (msggrupo) => {
        if (msggrupo.body === '!usuarios') {
            const chat = await msggrupo.getChat();

            let text = "";
            let mentions = [];
            for (let participant of chat.participants) {
                const contact = await bot.getContactById(participant.id._serialized);

                mentions.push(contact);
                text += `@${participant.id.user}`;

            }
            await chat.sendMessage(text, { mentions });

        }
    });

}

const msgContador = () => {
    bot.on('message', async (msgcont) => {

        const contact = await msgcont.getContact();
        const contador = await msgcont.getChat();
        if (contador.isGroup) {
            if (msgcont.body) {

                let numero = contact.number
                //let chats = contador.unreadCount
                const nusalvo2 = fs.readFileSync('./nusalvo.json', 'utf-8');
                const updat2 = JSON.parse(nusalvo2)
                //chat tem que iniciar com 1 nunca com zero
                let ChatInicio = 1
                let tem;
                let nao;

                updat2.forEach(el => {
                    //chat tem que iniciar com 1 nunca com zero

                    let nuUser = el[0]
                    let chatUser = el[1]
                    let chatContado = ''


                    if (nuUser === numero) {

                        chatContado++
                        if (chatUser) {
                            let chatFinal = chatUser + chatContado
                            Atualizar(el, 1, chatFinal)

                            fs.writeFileSync('./nusalvo.json', JSON.stringify(updat2, null, 2))

                        }
                    }
                    if (nuUser.includes(numero)) {
                        tem = nuUser.includes(numero)

                        return true;

                    } else {
                        nao = nuUser.includes(numero)
                        return false;
                    }

                });



                if (tem == true) {
                    //Analizar()

                } else if (nao == false) {
                    UPdateFile()
                }


                function Atualizar(a, i, novo) {
                    a[i] = novo
                }
                function UPdateFile() {
                    const LendoArquivo = fs.readFileSync('./nusalvo.json', 'utf-8');
                    const ConverteObjeto = JSON.parse(LendoArquivo)
                    ConverteObjeto.unshift([numero, ChatInicio])

                    const fileCaminho = './nusalvo.json';
                    const ConverteString = JSON.stringify(ConverteObjeto, null, 5)
                    fs.writeFileSync(fileCaminho, ConverteString)
                }

            }//if msg body

        }//ifgrupo
    })//bot
}//uncao


const TratarLinks = () => {
    bot.on('message', async (msgLink) => {
        let chatGrupo = await msgLink.getChat();
        if (chatGrupo.isGroup) {

            const recebida = msgLink.body.toLocaleLowerCase().substring(0, 5).trim().split(" ").join("");
            const enviada = msgLink.from

            if (recebida === 'https') {
                bot.sendMessage(enviada, "Aguarde Algun ADM vai analizar seu Link ! \n ADMs Online @Senhor Robô, @Alessandro");

            }
        }
    })
}


const MsgExcuida = () => {
    bot.on('message_revoke_everyone', async (ex) => {
        ex.reply('Mensagem Apagada com Sucesso!')
        const md = await MessageMedia.fromUrl('https://i.ibb.co/pxS2gpJ/deusleu-menor-748x410.jpg')
        ex.reply(md)

    });
}

const perfil = () => {
    bot.on('message', async (ft) => {

        const contact = await ft.getContact();
        const contador = await ft.getChat();
        const foto = await contact.getProfilePicUrl()

        if (foto == undefined || foto == '' || foto == isNaN) {
            const novoint = contact.number
            ft.reply(`Bem Vindo(a) ${novoint}`)
            ft.reply(menu.execute())

        } else if (foto) {
            if (contador.isGroup) {
                const novoNu = contact.number
                const picture = await MessageMedia.fromUrl(foto)
                const jsonar = fs.readFileSync('./nusalvo.json', 'utf-8');
                const upda = JSON.parse(jsonar)

                upda.forEach(el => {
                    let numeroUser = el[0]
                    let chatYUser = el[1]
                    if (novoNu === numeroUser) {
                        if (chatYUser <= 1) {
                            contador.sendMessage(`Olá @${novoNu} Bem Vindo Ao Grupo!`, {
                                mentions: [contact]

                            })
                            contador.sendMessage(picture)
                        }
                    }
                })
            }
        }//if else
    })//bot
}//fun


bot.initialize();
