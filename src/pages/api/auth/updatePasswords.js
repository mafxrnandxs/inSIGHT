const bcrypt = require('bcryptjs');

// Gerar uma senha criptografada
const passwordA = 'senhaA'; // senha original do Cliente A
const passwordB = 'senhaB'; // senha original do Cliente B
const passwordC = 'senhaC'; // senha original do Cliente C

const hashPassword = async (password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
};

// Chamar a função para cada senha
hashPassword(passwordA);
hashPassword(passwordB);
hashPassword(passwordC);
