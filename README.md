# Version Helper


O pacote npm "version-helper" é uma ferramenta desenvolvida internamente para Eludico para ajudar no gerenciamento de versões de projetos. Com este script, os desenvolvedores podem facilmente atualizar a versão do projeto, escolhendo entre as opções patch, minor ou major, no momento do commit e o script atualiza automaticamente a versão no arquivo package.json. Além disso, ele oferece a opção de fazer um commit automático com uma mensagem personalizada, tornando o processo de atualização de versão e commit mais eficiente. Este pacote é especialmente útil para projetos que exigem atualizações frequentes e precisam de um processo simplificado de gerenciamento de versão e commit.


## Instalação

Para instalar o Version Helper, execute o seguinte comando:

```bash
npm install --save-dev git+https://github.com/DanielTezolin/version-helper.git
```



## Utilização

Para utilizar o Version Helper, execute o seguinte comando na pasta do projeto:

```bash
 npx version-helper
```

O utilitário apresentará um menu de opções para atualização da versão no arquivo package.json. Após a escolha da nova versão, o Version Helper perguntará se deve criar um commit no Git automaticamente.

## Como contribuir

- Crie uma branch com a sua feature (git checkout -b minha-feature)
- Faça o commit das suas alterações (git commit -am 'Adicionando nova feature')
- Faça o push para a sua branch (git push origin minha-feature)
- Abra um Pull Request