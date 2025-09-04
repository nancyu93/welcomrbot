// Require the necessary discord.js classes
process.on('unhandledRejection', error => {
    console.error('🚨 Unhandled promise rejection:', error);
});

const { Client, Events, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { token } = require('./config.json');

// 創建一個客戶端實例，並開啟必要的 intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ]
});

// 記錄 GuildMemberAdd 觸發次數
let count = 0;

client.on(Events.GuildMemberAdd, async member => {
    count++;
    console.log(`[Debug] GuildMemberAdd 觸發第 ${count} 次, 用戶：${member.user.tag}`);

    try {
        // 直接從 API 拿頻道，使用頻道 ID
        const welcomeChannel = await member.guild.channels.fetch('1376097220604067892');
        if (!welcomeChannel) {
            console.log('找不到頻道！');
            return;
        }

        // 創建內嵌訊息
        const embed = new EmbedBuilder()
            .setColor(0xFFC0CB)
            .setTitle('<a:CG_mochi_welcome:1379261742449692685> 歡迎新成員！<a:CG_mochi_welcome:1379261742449692685>')
            .setDescription(`歡迎 **<@${member.id}>** 加入 **${member.guild.name}** <a:pokemon_sparkle:1379262743298707466>
**請先至<#1376087988538179637>閱讀規則並點及表情符號才看得到其他頻道唷 <a:Welcome:1379262282634231889>**`)
            .setAuthor({
                name: member.user.tag,
                iconURL: member.user.displayAvatarURL()
            })
            .setImage('https://cdn.discordapp.com/attachments/1282576286916542590/1410787740559343687/1.gif')
            .setTimestamp()
            .setFooter({ text: '加入時間', iconURL: member.guild.iconURL() });

        // 發送內嵌訊息
        await welcomeChannel.send({
            content: `歡迎 <@${member.id}> 加入伺服器！🎉`,
            embeds: [embed],
            allowedMentions: { users: [member.id] }
        });

    } catch (err) {
        console.error('發送歡迎訊息失敗：', err);
    }
});

// 登入機器人
client.login(token);
