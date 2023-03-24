import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, OneToMany, ManyToOne } from 'typeorm';
import { ProductImage } from './product-image.entity';
import { User } from '../../auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity( {name: 'products' } )
export class Product {

    @ApiProperty({ 
        example: '0d9ddaba-47ae-4eac-8a64-a5953cc690aa',
        description: 'Product id',
        uniqueItems: true,
     })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'Made on Earth by Humans Onesie',
        description: 'Product tittle',
        uniqueItems: true,
    })
    @Column('text',{
        unique: true,
    })
    title: string;

    @ApiProperty({
        example: '133',
        description: 'Product prices',
        // uniqueItems: true,
    })
    @Column('float',{
        default: 0,
    })
    price: number;

    @ApiProperty({
        example: 'Made on Earth by Humans Onesie',
        description: 'For the future space traveler with discerning taste, a soft, cotton onesie with snap closure bottom. Clear labeling provided in case of contact with a new spacefaring civilization. 100% Cotton. Made in Peru',
        // uniqueItems: true,
    })
    @Column({
        type: 'text',
        nullable: true,
    })
    description: string;

    @ApiProperty({
        example: 'made_on_earth_by_humans_onesie',
        description: 'Product slug',
    })
    @Column('text',{
        unique: true
    })
    slug: string;

    @ApiProperty({
        example: '10',
        description: 'Product stock',
        default: 0,
    })
    @Column('int', {
        default: 0,
    })
    stock: number;

    @ApiProperty({
        example: '["XS","S"]',
        description: 'Product sizes',
    })
    @Column('text', {
        array: true,
    })
    sizes: string[];

    @ApiProperty({
        example: "kid",
        description: 'Product gender',
    })
    @Column('text')
    gender: string;

    @ApiProperty()
    @Column('text',{
        array: true,
        default: []
    })
    tags: string[];
    
    //images
    @ApiProperty()
    @OneToMany(
        () => ProductImage,
        (productImage ) => productImage.product,
        { cascade: true, eager: true}
    )
    images?: ProductImage[];

    @ManyToOne(
        () => User,
        (user) => user.product,
        {eager: true}
    )
    user: User;

    @BeforeInsert()
    checkSlugInsert(){
        if( !this.slug)
            this.slug = this.title
        
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '')
    }

    @BeforeUpdate()
    checkSlugUpdate(){
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '')
    }
}
