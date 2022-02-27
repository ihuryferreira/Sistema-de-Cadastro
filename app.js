class View {
	constructor(nome, sobreNome, idade){
		this.nome = nome
		this.sobreNome = sobreNome
		this.idade = idade
	}
	validarDados(){
		for(let i in this) {
			if(this[i] == undefined || this[i] == '' || this[i] == null){
				return false
			}
		}
		return true
	}
}

//Banco de Dados history
class Bd {
	constructor(){
		let id = localStorage.getItem('id')

		if (id === null) {
			localStorage.setItem('id', 0)
		}
	}

	getProximoId(){
		//Recuperando dados 'id'
		let proximoId = localStorage.getItem('id')
		return parseInt(proximoId) + 1
	}

	gravar(dados){
		let id = this.getProximoId()
		
		localStorage.setItem(id, JSON.stringify(dados))

		localStorage.setItem('id', id)
	}

	recuperarTodosRegistros() {

		//array de cadastro
		let exe = Array()

		let id = localStorage.getItem('id')

		//recuperar todas as despesas cadastradas em localStorage
		for(let i = 1; i <= id; i++) {

			//recuperar a despesa
			let ex = JSON.parse(localStorage.getItem(i))

			//existe a possibilidade de haver índices que foram pulados/removidos
			//nestes casos nós vamos pular esses índices
			if(ex === null) {
				continue
			}
			ex.id = i
			exe.push(ex)
		}

		return exe
	}

	remover(id){
		localStorage.removeItem(id)
	}
}

let bd = new Bd()

function cadastrar(){
	//obtendo Dados do input
	let nome = document.getElementById('nome')
	let sobreNome = document.getElementById('sobreNome')
	let idade = document.getElementById('idade')
	
	//Recebendo dados dentro do Construtor View
	let exe =  new View(
		nome.value,
		sobreNome.value,
		idade.value
	)
	//Mensagem no modal de Registro
	if(exe.validarDados()) {
		bd.gravar(exe)

		document.getElementById('modal_titulo').innerHTML = 'Registro inserido com sucesso'
		document.getElementById('modal_titulo_div').className = 'modal-header text-success'
		document.getElementById('modal_conteudo').innerHTML = 'Usuário foi cadastrada com sucesso!'
		document.getElementById('modal_btn').innerHTML = 'Voltar'
		document.getElementById('modal_btn').className = 'btn btn-success'
		document.getElementById('modal_btn').style.marginTop = '2px';

		//dialogo de Sucesso
		$('#modalRegistraUsuario').modal('show')

		nome.value = '' 
		sobreNome.value = ''
		idade.value = ''

	} else {
		document.getElementById('modal_titulo').innerHTML = 'Erro na inclusão do registro'
		document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
		document.getElementById('modal_conteudo').innerHTML = 'Erro na gravação, verifique se todos os campos foram preenchidos corretamente!'
		document.getElementById('modal_btn').innerHTML = 'Voltar e corrigir'
		document.getElementById('modal_btn').className = 'btn btn-danger'
		document.getElementById('modal_btn').style.marginTop = '2px';
		//dialogo de Erro
		$('#modalRegistraUsuario').modal('show')
	}
}

//Armazenar mensagem na pagina web

function carragarListaDeUsuario(exe = Array(), filtro = false) {

    if(exe.length == 0 && filtro == false){
		exe = bd.recuperarTodosRegistros() 
	}
	

	/*
	Exemplo de como Ficarar o Registro de Usuario no formulario
	<tr>
		<td>15/03/2018</td>
		<td>Alimentação</td>
		<td>Compras do mês</td>
		<td>444.75</td>
	</tr>

	*/

	let listaUsuario = document.getElementById("resps")
    listaUsuario.innerHTML = ''
	exe.forEach(function(dados){

		//Criando a linha (tr)
		var linha = listaUsuario.insertRow();

		//Criando as colunas (td)
		linha.insertCell(0).innerHTML = `${dados.id}` 

		//Metodo de opções, Desabilitei, pois não vou utilizar..
		// //Ajustar o tipo
		// switch(dados.tipo){
		// 	case '1': dados.tipo = 'Nome'
		// 		break
		// 	case '2': dados.tipo = 'Sobre Nome'
		// 		break
		// 	case '3': dados.tipo = 'Idade'
		// 		break
			
		// }

		//inserindo os dados na coluna
		linha.insertCell(1).innerHTML = dados.nome
		linha.insertCell(2).innerHTML = dados.sobreNome
		linha.insertCell(3).innerHTML = dados.idade

		//Criar o botão de exclusão
		let btn = document.createElement('button')
		btn.className = 'btn btn-danger'
		btn.innerHTML = '<i class="fa fa-times"  ></i>'
		btn.id = `id_despesa_${dados.id}`
		btn.onclick = function(){
			let id = this.id.replace('id_despesa_','')
			// alert("Item Excluido Com Sucesso!")
			if(id) {
				alert("Item foi Excluido Com Sucesso!!")				
			}
			bd.remover(id)
			window.location.reload()
		}
		linha.insertCell(4).append(btn)
		console.log(dados)
	})
 }
