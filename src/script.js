
// L(G) = { x | x ∈ T* e não tenha a's consecutivos }, T = {a, b, c}

//   q0 = último símbolo NÃO foi 'a' (ou ainda não leu nada)
//   q1 = último símbolo foi 'a'
//   qe = estado de erro (apareceu "aa" ou símbolo fora do alfabeto)

const estadoInicial = 'q0';
const estadosFinais = ['q0', 'q1'];

// tabela de transição: transicoes[estadoAtual][simbolo] = proximoEstado
const transicoes = {
    q0: { a: 'q1', b: 'q0', c: 'q0' },
    q1: { a: 'qe', b: 'q0', c: 'q0' },
    qe: { a: 'qe', b: 'qe', c: 'qe' },
};

// se o símbolo não existe no alfabeto (ex: 'd'), vai para o estado de erro
function delta(estado, simbolo) {
    return transicoes[estado][simbolo] ?? 'qe';
}

// le a palavra símbolo a símbolo e devolve a lista de estados percorridos
function percorrer(palavra) {
    const caminho = [estadoInicial];
    let estado = estadoInicial;

    for (const simbolo of palavra) {
        estado = delta(estado, simbolo);
        caminho.push(estado);
    }
    return caminho;
}

// aceita se o último estado do caminho é um estado final
function aceita(caminho) {
    return estadosFinais.includes(caminho[caminho.length - 1]);
}


// VISUAL
// <><><><><>

const campo = document.getElementById('entrada');
const saida = document.getElementById('saida');
const trajeto = document.getElementById('trajeto');
const linhasTabela = document.querySelectorAll('.tabela tbody tr');

// letras de a - z
function limpar(texto) {
    return texto
        // .toLowerCase()
        .replace(/[^a-z ]/g, '') // remove símbolos especiais
        .replace(/^ +/, '')      // não aceita espaço no início
        .replace(/ {2,}/g, ' '); // não aceita espaços repetidos
}

// Destaca na tabela a linha do estado atual:
function destacarEstado(estado) {
    const ehFinal = estadosFinais.includes(estado);

    linhasTabela.forEach((linha) => {
        const nomeDoEstado = linha.cells[0].textContent.trim();
        const ehOAtual = nomeDoEstado === estado;

        linha.classList.toggle('estado-aceito', ehOAtual && ehFinal);
        linha.classList.toggle('estado-rejeitado', ehOAtual && !ehFinal);
    });
}

// mostra o caminho percorrido
function mostrarCaminho(caminho) {
    trajeto.textContent = 'Estados: ' + caminho.join(' -> ');
}

campo.addEventListener('input', () => {
    campo.value = limpar(campo.value);

    // quando digita o espaço
    if (campo.value.endsWith(' ')) {
        const sentenca = campo.value.trim().split(' ').pop(); // para caso colar palavras
        const caminho = percorrer(sentenca);

        const foiAceita = aceita(caminho);

        saida.textContent = `"${sentenca}" -> ${foiAceita ? 'ACEITA' : 'REJEITADA'}`;
        saida.className = foiAceita ? 'aceita' : 'rejeitada'; // cor verde/vermelha
        mostrarCaminho(caminho);
        destacarEstado(caminho[caminho.length - 1]);
        campo.value = ''; // limpa o campo para a próxima sentença
        return;
    }

    // mostra a troca de estado a cada símbolo
    const caminho = percorrer(campo.value);
    saida.textContent = '...';
    saida.className = '';
    mostrarCaminho(caminho);
    destacarEstado(caminho[caminho.length - 1]);
});

// estado inicial
destacarEstado(estadoInicial);
mostrarCaminho([estadoInicial]);