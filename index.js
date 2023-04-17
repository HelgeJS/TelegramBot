const TelegramBot = require('node-telegram-bot-api')
const {againOptions, startOptions} = require('./options')

const token = '5730793824:AAE0DwuDskTk0EmRrKpy6zRYHu4xi0F0oD4'

const bot = new TelegramBot(token, {polling: true})      //Идентификация бота

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю цифру он 0 до 9, попробуй угадать!')
    let randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber
    await bot.sendMessage(chatId, 'Я загадал. Отгадывай!', startOptions)
}

const start = () => {
    bot.setMyCommands([                                                 //Создания меню команд
        {command: '/start', description:'Начальное приветсвие'},
        {command: '/info', description:'Информация о пользователе'},
        {command: '/game', description:'Игра в числа'}
    ])
    
    
    bot.on ('message', async id => {
        const text = id.text        //Выделение текста, получаемого ботом
        const chatId = id.chat.id       //Выделение ID чата
    
        if(text === '/start') {
          await  bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/697/ba1/697ba160-9c77-3b1a-9d97-86a9ce75ff4d/192/1.webp')
         return await bot.sendMessage(chatId, `Добро пожаловать в тестирование бота!`)   
        }  
        if(text === '/info') {
         return await bot.sendMessage(chatId, `Тебя зовут ${id.from.first_name}, а логин - ${id.from.username?id.from.username : 'a логин не нашел'}`)   
        }
        if(text === '/game') {
          return startGame(chatId)
        }
        return bot.sendMessage(chatId, `${id.from.first_name}, Такой команды у меня пока нету!(`)
    })

    bot.on('callback_query', async msg => {
        const data = msg.data
        const chatId = msg.message.chat.id
        if(data === '/again') {
           return startGame(chatId)
        }
        if(Number(data) == chats[chatId]) {
            return bot.sendMessage(chatId, `Ты угадал, бот загадал ${chats[chatId]},`, againOptions)
        } else {
            return bot.sendMessage(chatId, `Ты не угадал. Бот загадал ${chats[chatId]}`, againOptions)
        }
    })
}
start()