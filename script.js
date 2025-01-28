function downloadJSON(jsonData) {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(jsonData));
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

function adicionarRegistro() {
    const nome = document.getElementById('nome').value;
    const carga = document.getElementById('carga').value;
    const novoRegistro = { nome, carga };
    let dados = JSON.parse(localStorage.getItem('meusDados')) || [];
    dados.push(novoRegistro);
    localStorage.setItem('meusDados', JSON.stringify(dados));
    exibirTabela();
}

function exibirTabela() {

    const tabela = document.getElementById('minhaTabela').getElementsByTagName('tbody')[0];
    tabela.innerHTML = '';

    const dados = JSON.parse(localStorage.getItem('meusDados')) || [];
    dados.forEach((registro, index) => {
        const novaLinha = tabela.insertRow();
        const celulaNome = novaLinha.insertCell();
        const celulaCarga = novaLinha.insertCell();
        const celulaAcoes = novaLinha.insertCell();

        celulaNome.textContent = registro.nome;
        celulaCarga.textContent = registro.carga;

        const botaoExcluir = document.createElement('button');
        botaoExcluir.textContent = 'DEL';
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

window.onload = function() {
    exibirTabela();
};