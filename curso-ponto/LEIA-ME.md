# Curso Ponto
Uma empresa do Grupo Ponto. Site sem tags de Analytics ou GTM.

## Jornada
index.html apresenta a formação e leva a interesse.html. O formulário valida nome, telefone e e-mail, sem transmitir ou persistir esses dados. Depois, redireciona para sucesso.html, que oferece o material-curso-ponto.txt para download.

Mantenha os arquivos juntos. A submissão é fictícia. A página de sucesso pode ser acessada diretamente; sua visualização não comprova um novo envio. Os depoimentos são fictícios e estão identificados como ilustrativos.

## Pontos para futura instrumentação
- Interesse: links para interesse.html.
- Envio: sucesso da validação do formulário, antes do redirecionamento.
- Download: link download-material.
Não há eventos de Analytics implementados. Não enviar nome, telefone ou e-mail ao GA4, nem incluí-los em URLs ou na camada de dados. O arquivo TXT não deve ser presumido como download automaticamente detectado pela medição otimizada; configurar e validar a medição desse clique numa prática futura.
