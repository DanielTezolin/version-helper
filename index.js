#!/usr/bin/env node

// Importa as bibliotecas necessárias
import fs from 'fs';
import { exec } from 'child_process';
import readlineLib from 'readline';
import inquirer from 'inquirer';

// Lê o arquivo package.json
const packageJsonPath = './package.json'
let packageJson;

try {
    packageJson = fs.readFileSync(packageJsonPath, 'utf-8');
} catch (err) {
    console.error('Erro ao ler o arquivo package.json:', err.message);
    process.exit(1);
}

// Obtém a versão atual do arquivo package.json
const versaoAtual = JSON.parse(packageJson).version;

if (!versaoAtual) {
    console.error('A versão não foi encontrada no arquivo package.json');
    process.exit(1);
}

console.clear();

// Imprime a versão atual no console
console.log(`Versão atual: ${versaoAtual}`);

function main() {

    commitTogether();

}

function commitTogether() {

    const questions = [
        {
            type: 'list',
            name: 'commitTogether',
            message: 'Deseja fazer um commit automaticamente?',
            choices: [
                {
                    name: 'Sim',
                    value: true,
                },
                {
                    name: 'Não',
                    value: false,
                },
            ],
        },
    ];

    inquirer.prompt(questions).then((answers) => {
        const { commitTogether } = answers;

        versionQuestion(commitTogether);
    });

}

function versionQuestion(commitTogetherResponse) {
    // Pergunta ao usuário se ele quer fazer um commit depois da atualização
    const questions = [
        {
            type: 'list',
            name: 'commitType',
            message: 'Escolha um tipo de commit:',
            choices: [
                {
                    name: '1) patch - Correção de bug',
                    value: 'patch',
                },
                {
                    name: '2) minor - Nova Feature',
                    value: 'minor',
                },
                {
                    name: '3) major - Mudanças muito grandes',
                    value: 'major',
                },
                {
                    name: '4) salvar código - Nada será feito',
                    value: 'none',
                },
            ],
        },
    ];

    inquirer.prompt(questions).then((answers) => {
        const { commitType } = answers;
        let novaVersao
        let emojiCommit
        let ignoreSaveVersion = false

        // Verifica a escolha do usuário e atualiza a versão correspondente
        switch (commitType) {
            case 'patch':
                novaVersao = versaoAtual.replace(/(\d+\.\d+\.)(\d+)/, (_, p1, p2) => p1 + (parseInt(p2) + 1));
                emojiCommit = 'fix: 🐛'
                break;
            case 'minor':
                novaVersao = versaoAtual.replace(
                    /(\d+\.)(\d+\.)(\d+)/,
                    (_, p1, p2, p3) => p1 + (parseInt(p2) + 1) + '.0',
                );
                emojiCommit = 'feat: ✨'
                break;
            case 'major':
                novaVersao = versaoAtual.replace(/(\d+\.)(\d+\.)(\d+)/, (_, p1, p2, p3) => parseInt(p1) + 1 + '.0.0');
                emojiCommit = 'major: 🚀 '
                break;
            case 'none':
                ignoreSaveVersion = true
                emojiCommit = 'working: 🚧'
                break;
        }

        if (!ignoreSaveVersion) {
            // Atualiza a versão no arquivo package.json
            const novoPackageJson = packageJson.replace(/("version":\s*")(\d+\.\d+\.\d+)(")/, `$1${novaVersao}$3`);
            fs.writeFileSync(packageJsonPath, novoPackageJson, 'utf-8');

            // Imprime a nova versão no console
            console.log(`Nova versão: ${novaVersao}`);
        }



        if (commitTogetherResponse) {
            // Cria uma nova interface para ler a mensagem de commit
            const commitMessage = readlineLib.createInterface({
                input: process.stdin,
                output: process.stdout,
            });
            // Limpa o console
            console.clear();
            // Lê a mensagem de commit do usuário
            commitMessage.question('Mensagem do commit: ', (mensagem) => {
                // Define os comandos git para adicionar e commitar as alterações
                console.log(`Mensagem: ${emojiCommit} - ${mensagem}`);

                const comando1 = `git add --all`;
                const comando2 = `git commit -m "[vm] ${emojiCommit} - ${mensagem}"`;
                // const comando3 = `git commit -m "${mensagem}"`;

                // Executa o comando de adicionar as alterações com o Git
                exec(comando1, (erro, stdout, stderr) => {
                    if (erro) {
                        console.error(`Erro ao executar o comando '${comando1}': ${erro}`);
                        process.exit(1);
                    }

                    // Executa o comando de fazer o commit com o Git
                    exec(comando2, (erro, stdout, stderr) => {
                        if (erro) {
                            console.error(`Erro ao executar o comando '${comando2}': ${erro}`);
                            process.exit(1);
                        }

                        // Exibe uma mensagem de sucesso no console
                        console.log('Commit realizado com sucesso!');
                        console.log('Agora execute o comando "git push" para enviar. ');
                        process.exit(0);
                    });
                });
            });
        }
    });
}


main()