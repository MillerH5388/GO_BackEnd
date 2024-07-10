const path = require('path');
const fs = require('fs');

class Upload{
    
    constructor(app, express, upload_directory) {
        this.upload_directory = upload_directory
        app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
    }

    async criar_diretorio(diretorio)
    {
        return new Promise(async (resolve,reject) => {

            fs.mkdir(path.join(__dirname, diretorio), { recursive: true }, (err) => {

                if (err) resolve(false);
                resolve(true)
    
            });
            
        })
    }

    async upload_file(diretorio, file)
    {
        return new Promise(async (resolve,reject) => {

            await this.criar_diretorio(diretorio)
            const nome = file.originalname
            let path_file = diretorio+'/'+nome
            let contador = 1
            while(this.fileExists(path_file))
            {
                path_file = diretorio+'/('+contador+')'+nome
                contador++
            }

            fs.writeFile(path.join(__dirname,path_file), file.buffer, (err) => {
                if (err) resolve(false);

                path_file = path_file.replaceAll('../', '')
                const link = this.upload_directory+"/"+path_file
                resolve(link)
            })

        })
    }

    isImageFile(file)
    {
        return (file.mimetype.startsWith('image/'))
    }

    fileExists(arquivo)
    {
        return fs.existsSync(path.join(__dirname,arquivo))
    }

    verifica_foto_body(files, nome)
    {
        if(!files) return false
        const foto = files.find(file => file.fieldname == nome)
        return foto
    }


}
module.exports = Upload;