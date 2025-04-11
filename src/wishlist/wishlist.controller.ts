import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  ParseIntPipe, 
  BadRequestException, 
  UseGuards, 
  Request 
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from '@prisma/client';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AddProductToWishlistDto } from './dto/add-product-to-wishlist.dto';
import { JwtAuthGuard } from 'src/cognito-auth/cognito-auth.guard';
import { RemovePoductFromWishlistDto } from './dto/remove-product-from-wishlist.dto';

@ApiTags('Wishlist')
@Controller('wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}
  
  @Post()
  @ApiOperation({ summary: 'Create a wishlist' })
  @ApiResponse({ status: 201, description: 'Wishlist successfully created' })
  @ApiResponse({ status: 500, description: 'Error creating wishlist' })
  @ApiBody({ type: CreateWishlistDto })
  create(@Body() createWishlistDto: CreateWishlistDto, @Request() req): Promise<Wishlist> {
    const userId = req.user.userId;
    return this.wishlistService.create(createWishlistDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all wishlists' })
  @ApiResponse({ status: 200, description: 'List of wishlists found' })
  @ApiResponse({ status: 404, description: 'No wishlists found' })
  @ApiResponse({ status: 500, description: 'Error getting all wishlists' })
  findAll(): Promise<Wishlist[]> {
    return this.wishlistService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtain a wishlist' })
  @ApiParam({ name: 'id', description: 'Wishlist ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Wishlist found' })
  @ApiResponse({ status: 404, description: 'Wishlist not found' })
  @ApiResponse({ status: 500, description: 'Error getting wishlist' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Wishlist> {
    return this.wishlistService.findOne(id); 
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a wishlist' })
  @ApiParam({ name: 'id', description: 'ID of the wishlist to be updated', example: 1 })
  @ApiBody({ type: UpdateWishlistDto })
  @ApiResponse({ status: 200, description: 'Wishlist correctly updated' })
  @ApiResponse({ status: 404, description: 'Wishlist not found' })
  @ApiResponse({ status: 500, description: 'Error updating wishlist' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateWishlistDto: UpdateWishlistDto): Promise<Wishlist> {
    return this.wishlistService.update(id, updateWishlistDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a wishlist' })
  @ApiParam({ name: 'id', description: 'ID of the wishlist to be deleted', example: 1 })
  @ApiResponse({ status: 200, description: 'Wishlist correctly eliminated' })
  @ApiResponse({ status: 404, description: 'Wishlist not found' })
  @ApiResponse({ status: 500, description: 'Error deleting wishlist' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<Wishlist> {
    return this.wishlistService.remove(id);
  }

  @Post('add-product')
  @ApiOperation({ summary: 'Add a product to a wishlist' })
  @ApiBody({ type: AddProductToWishlistDto })
  @ApiResponse({ status: 200, description: 'Product successfully added to wishlist' })
  @ApiResponse({ status: 404, description: 'Wishlist or Product not found' })
  @ApiResponse({ status: 500, description: 'Error adding product to wishlist' })
  addProductToWishlist(
    @Body() addProductToWishlistDto: AddProductToWishlistDto,
    @Request() req
  ) {
    if(addProductToWishlistDto.productId <= 0){ 
      throw new BadRequestException('Product ID must be greater than 0');
    }
    if(addProductToWishlistDto.wishlistId <= 0){
      throw new BadRequestException('Wishlist ID must be greater than 0');
    }
    const userId = req.user.userId;
    return this.wishlistService.addProductToWishlist(addProductToWishlistDto, userId);
  }

  @Delete('remove-product')
  @ApiOperation({ summary: 'Remove a product from a wishlist' })
  @ApiBody({ type: RemovePoductFromWishlistDto })
  @ApiResponse({ status: 200, description: 'Product successfully removed from wishlist' })
  @ApiResponse({ status: 404, description: 'Wishlist or Product not found' })
  @ApiResponse({ status: 500, description: 'Error removing product from wishlist' })
  removeProductFromWishlist(
    @Body() removeProductFromWishlist: RemovePoductFromWishlistDto,
    @Request() req
  ) {
    if(removeProductFromWishlist.productId <= 0){ 
      throw new BadRequestException('Product ID must be greater than 0');
    }
    if(removeProductFromWishlist.wishlistId <= 0){
      throw new BadRequestException('Wishlist ID must be greater than 0');
    }
    const userId = req.user.userId;
    return this.wishlistService.removeProductFromWishlist(removeProductFromWishlist, userId);
  }
}
