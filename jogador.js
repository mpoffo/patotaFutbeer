class Jogador {

    static PESOS_DEFESA = { VELOCIDADE: 30, HABILIDADE: 20, MARCACAO: 50 };
    static PESOS_ATAQUE = { VELOCIDADE: 30, HABILIDADE: 45, MARCACAO: 25 };

    constructor(nome, dentro, listPriority, predominancia, velocidade, habilidade, marcacao, convidado, gols) {
        this.nome = nome;
        this.dentro = dentro;
        this.listPriority = listPriority;
        this.predominancia = predominancia;
        this.velocidade = velocidade;
        this.habilidade = habilidade;
        this.marcacao = marcacao;
        this.convidado = convidado;
        this.gols = gols;

        this.calcAllScores();
    } 

    getFoto() {
        return "img/" + (this.convidado ? "convidado" : this.nome) + ".png";
    }

    calculaScore(posicao) {
        var pesos = null;
        if (posicao == "ATAQUE") {
            pesos = Jogador.PESOS_ATAQUE;
        } else {
            pesos = Jogador.PESOS_DEFESA;
        }
        var score = (this.velocidade * pesos.VELOCIDADE / 100) +
            (this.habilidade * pesos.HABILIDADE / 100) +
            (this.marcacao * pesos.MARCACAO / 100);
        return parseFloat(parseFloat(score).toFixed(2));
    }

    calcAllScores() {
        this.scoreDefesa = this.calculaScore("DEFESA");
        this.scoreAtaque = this.calculaScore("ATAQUE");
        this.score = parseFloat(((this.scoreAtaque + this.scoreDefesa) / 2).toFixed(2));
    }

    updateVelocidade(rating) {
        this.updateRating("VELOCIDADE", rating);
    }

    updateHabilidade(rating) {
        this.updateRating("HABILIDADE", rating);
    }

    updateMarcacao(rating) {
        this.updateRating("MARCACAO", rating);
    }

    updateRating(type, rating) {
        if (type == "VELOCIDADE") {
            this.velocidade = rating;
        } else if (type == "HABILIDADE") {
            this.habilidade = rating;
        } else { //MARCAÇÃO
            this.marcacao = rating;
        }

        this.calcAllScores();
    }
}

Jogador.fromListJson = function (jsonList) {
    return jsonList
        .map(j => Jogador.fromJSON(j));
}

Jogador.fromJSON = function(json) {
    return new Jogador(json.nome, json.dentro, json.listPriority, json.predominancia, json.velocidade, json.habilidade, json.marcacao, json.convidado, json.gols);
}