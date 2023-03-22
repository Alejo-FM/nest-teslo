import { Controller, Get, Post, Res , Param,  UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';
import { Response } from 'express'

import { fileFilter, fileNamer } from './helpers';
import { ConfigService } from '@nestjs/config';


@Controller('files')
export class FilesController {
  constructor( 
    private readonly FilesService: FilesService,
    private readonly configService: ConfigService  
  ){}

  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ){
    const path = this.FilesService.getStaticProductImage(imageName)
    
    // res.status(403).json({
    //   ok: false,
    //   path: path,
    // })

    res.sendFile( path );
  }

  @Post('product')
  @UseInterceptors( FileInterceptor('file', {
    fileFilter: fileFilter,
    // limits: {fileSize: 1000},
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer,
    }),
  }))
  uploadProductImage(
    @UploadedFile() 
    file: Express.Multer.File 
  ) {

    if( !file ){
      throw new BadRequestException(`Make sure that the file is an image`)
    }

    // const secureUrl = `${file.filename}`
    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`

    console.log({fileInController: file})
    return { secureUrl };
  }

}
