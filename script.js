function downloadJSON(jsonData) {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(jsonData);
    const downloadLink = document.createElement("a");
    downloadLink.setAttribute("href", dataStr);
    downloadLink.setAttribute("download", "meu_arquivo.json");
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

function exportarJSON() {
    const jsonSalvo = localStorage.getItem('meusDados');
    downloadJSON(jsonSalvo);
}

function ajustarVersaoDoJSON() {

    const dados = JSON.parse(localStorage.getItem('meusDados')) || [];
    dados.forEach(objeto => {
        mudarCampoPrimeiroNivelDeUmRotuloParaOutroRotulo(objeto, 'nome', 'exercicio');
    });
    localStorage.setItem('meusDados', JSON.stringify(dados));
}

function mudarCampoPrimeiroNivelDeUmRotuloParaOutroRotulo(objeto, nomeAntigo, nomeAtual) {
    if (nomeAntigo in objeto) {
        objeto[nomeAtual] = objeto[nomeAntigo];
        delete objeto[nomeAntigo];
    }
}

function adicionarRegistro() {
    const exercicio = document.getElementById('exercicio').value;
    const carga = document.getElementById('carga').value;
    const novoRegistro = { exercicio, carga };
    let dados = JSON.parse(localStorage.getItem('meusDados')) || [];
    dados.push(novoRegistro);
    localStorage.setItem('meusDados', JSON.stringify(dados));
    limparCamposNaTela();
    exibirTabela();
}


function limparCamposNaTela() {
    document.getElementById('exercicio').value = ''
    document.getElementById('carga').value = ''
}


function exibirTabela() {

    const tabela = document.getElementById('tabelaTreinos').getElementsByTagName('tbody')[0];
    tabela.innerHTML = '';

    const dados = JSON.parse(localStorage.getItem('meusDados')) || [];
    dados.forEach((registro, index) => {
        const novaLinha = tabela.insertRow();
        const celulaExercicio = novaLinha.insertCell();
        const celulaCarga = novaLinha.insertCell();
        const celulaAcoes = novaLinha.insertCell();

        celulaExercicio.textContent = registro.exercicio;
        celulaCarga.textContent = registro.carga;

        const botaoExcluir = document.createElement('button');
        botaoExcluir.textContent = 'DEL';
        botaoExcluir.classList.add('botaoExcluir');
        botaoExcluir.onclick = () => {
            excluirRegistro(index);
        };
        celulaAcoes.appendChild(botaoExcluir);
    });
}

function excluirRegistro(index) {
    let dados = JSON.parse(localStorage.getItem('meusDados')) || [];
    dados.splice(index, 1);
    localStorage.setItem('meusDados', JSON.stringify(dados));
    exibirTabela();
}

function excluirUltimoRegistro() {
    let dados = JSON.parse(localStorage.getItem('meusDados')) || [];
    dados.pop();
    localStorage.setItem('meusDados', JSON.stringify(dados));
    exibirTabela();
}

function excluirTodosRegistros() {
    if (confirm("Tem certeza que deseja excluir todos os registros?")) {
        localStorage.clear();
        exibirTabela();
    }
}


function criarListenerDeImportacaoDeJson() {
    const input = document.getElementById('botaoImportarJsonDeTreino');
    input.addEventListener('change', () => {
      const reader = new FileReader();

      reader.onload = () => {
        const json = JSON.parse(reader.result);
        localStorage.setItem('meusDados', JSON.stringify(json));
        console.log('JSON importado com sucesso!');
        exibirTabela();
      };

      reader.readAsText(input.files[0]);
    });
}

function criarListenerDeZoom() {

    const input = document.getElementById('zoomInput');
    const elementoZoom = document.getElementById('container');

    input.addEventListener('input', () => {
        const valorZoom = input.value;
        elementoZoom.style.transform = `scale(${valorZoom})`;
    });

}

function init() {
    criarListenerDeImportacaoDeJson();
    criarListenerDeZoom();
    ajustarVersaoDoJSON();

    window.onload = function() {
        exibirTabela();
    };
}

init()
