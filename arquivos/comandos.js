
function execute() {

    let tempo = new Date();
    let horas = tempo.getHours();

    if (horas <= 12) {
        return '\nBom Dia Familía!\n\nPara Me Chamar Digite !bot'
    } else if (horas <= 17) {
        return '\nBoa Tarde Familía!\n\nPara Me Chamar Digite !bot'

    } else {
        return '\nBoa Noite Familía!\n\nPara Me Chamar Digite !bot'
    }

}

exports.execute = execute