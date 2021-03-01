/**
 * Sends information about errors or other messages from the bot to admins
 *  @param {string} type information type
    @param {string} msg any information from the bot

    @example 
        botLogger('Error', 'You are too precious for this world');
    @example 
        <caption> Using caught error </caption>
        catch(err => botLogger('Bot Error', err));
    @author Ihor @bujhmt
        
*/
const botLogger = async (type, msg) => 
{
  const logTime = new Date(new Date()
                .toLocaleString("UA", {timeZone: "Europe/Kiev"}))
                .toLocaleTimeString();

  const logInformation = `***Time***: ${logTime} \n***Type***: ${type} \n***Information***: ${msg}`;
  const parse_mode = 'Markdown';
  bot.sendMessage(process.env.ADMIN, logInformation, { parse_mode });
}

module.exports = botLogger;