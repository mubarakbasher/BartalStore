import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { DeliveryZone } from '@bartal/shared';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
import { CurrentUser, type AuthedUser } from '../../common/decorators/current-user.decorator';
import { imageMimeFilter } from '../storage/helpers/keys';
import {
  AbandonedCartsQueryDto,
  CreateBannerDto,
  CreateCategoryDto,
  CreateProductDto,
  CreatePromoDto,
  CreateRefundDto,
  InventoryMovementsQueryDto,
  ListAdminReviewsQueryDto,
  ListAuditFeedQueryDto,
  ListBannersQueryDto,
  ListPromosQueryDto,
  ListRefundsQueryDto,
  ListShippingLabelsQueryDto,
  MarkLabelsPrintedDto,
  MoveBannerDto,
  RejectRefundDto,
  RejectReviewDto,
  SALES_BREAKDOWNS,
  type SalesBreakdown,
  UpdateBannerDto,
  UpdateCategoryDto,
  UpdateOrderPaymentDto,
  UpdateOrderStatusDto,
  UpdateProductDto,
  UpdateProductImageDto,
  UpdatePromoDto,
  UpdateSettingsDto,
  UpdateZoneFeeDto,
  UploadProductImageDto,
} from './dto/admin.dto';
import { AdminService } from './admin.service';

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  // --- Dashboard & analytics ---
  @Get('dashboard') @ApiOperation({ summary: 'Dashboard KPIs' })
  dashboard() { return this.admin.dashboard(); }

  @Get('analytics/sales') @ApiOperation({ summary: 'Sales analytics (optional zone breakdown)' })
  salesAnalytics(
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('breakdown') breakdown?: string,
  ) {
    const safeBreakdown: SalesBreakdown =
      breakdown && (SALES_BREAKDOWNS as readonly string[]).includes(breakdown)
        ? (breakdown as SalesBreakdown)
        : 'none';
    return this.admin.salesAnalytics(from, to, safeBreakdown);
  }

  @Get('analytics/products') @ApiOperation({ summary: 'Top products' })
  topProducts(@Query('limit') limit?: string) {
    return this.admin.topProducts(limit ? Number(limit) : undefined);
  }

  // --- Inventory log (Slice 3b-1) ---
  @Get('inventory/movements') @ApiOperation({ summary: 'List inventory movements (with KPIs)' })
  inventoryMovements(@Query() query: InventoryMovementsQueryDto) {
    return this.admin.getInventoryMovements(query);
  }

  // --- Abandoned carts (Slice 3b-1) ---
  @Get('abandoned-carts') @ApiOperation({ summary: 'List abandoned carts with recovery scoring' })
  abandonedCarts(@Query() query: AbandonedCartsQueryDto) {
    return this.admin.getAbandonedCarts(query);
  }

  @Post('abandoned-carts/:userId/sms') @ApiOperation({ summary: 'Send recovery SMS to an abandoned cart (24h rate-limit)' })
  sendAbandonedCartSms(
    @CurrentUser() u: AuthedUser,
    @Param('userId') userId: string,
  ) {
    return this.admin.sendAbandonedCartSms(userId, u.id);
  }

  // --- Refunds (Slice 3b-2) ---
  @Get('refunds') @ApiOperation({ summary: 'List refund requests with counts' })
  listRefunds(@Query() query: ListRefundsQueryDto) {
    return this.admin.listRefunds(query);
  }

  @Post('refunds') @ApiOperation({ summary: 'Admin-create a refund request' })
  createRefund(@CurrentUser() u: AuthedUser, @Body() dto: CreateRefundDto) {
    return this.admin.createRefund(dto, u.id);
  }

  @Post('refunds/:id/approve') @ApiOperation({ summary: 'Approve refund + flip Order to REFUNDED' })
  approveRefund(@CurrentUser() u: AuthedUser, @Param('id') id: string) {
    return this.admin.approveRefund(id, u.id);
  }

  @Post('refunds/:id/reject') @ApiOperation({ summary: 'Reject refund with a reason' })
  rejectRefund(
    @CurrentUser() u: AuthedUser,
    @Param('id') id: string,
    @Body() dto: RejectRefundDto,
  ) {
    return this.admin.rejectRefund(id, dto, u.id);
  }

  // --- Shipping labels (Slice 3b-2) ---
  @Get('shipping-labels') @ApiOperation({ summary: 'List orders ready to print (or already printed)' })
  listShippingLabels(@Query() query: ListShippingLabelsQueryDto) {
    return this.admin.listShippingLabels(query);
  }

  @Post('shipping-labels/mark-printed') @ApiOperation({ summary: 'Mark a batch of orders as printed' })
  markLabelsPrinted(@CurrentUser() u: AuthedUser, @Body() dto: MarkLabelsPrintedDto) {
    return this.admin.markLabelsPrinted(dto, u.id);
  }

  // --- Templates (Slice 3b-2) ---
  @Get('templates') @ApiOperation({ summary: 'Read-only viewer of bilingual SMS templates' })
  getTemplates() {
    return this.admin.getTemplates();
  }

  // --- Promos (Slice 3b-3) ---
  @Get('promos') @ApiOperation({ summary: 'List promo codes with counts payload' })
  listPromos(@Query() query: ListPromosQueryDto) {
    return this.admin.listPromos(query);
  }

  @Post('promos') @ApiOperation({ summary: 'Create promo code' })
  createPromo(@CurrentUser() u: AuthedUser, @Body() dto: CreatePromoDto) {
    return this.admin.createPromo(dto, u.id);
  }

  @Put('promos/:id') @ApiOperation({ summary: 'Update promo code' })
  updatePromo(
    @CurrentUser() u: AuthedUser,
    @Param('id') id: string,
    @Body() dto: UpdatePromoDto,
  ) {
    return this.admin.updatePromo(id, dto, u.id);
  }

  @Delete('promos/:id') @ApiOperation({ summary: 'Soft-delete promo code (is_active=false)' })
  deletePromo(@CurrentUser() u: AuthedUser, @Param('id') id: string) {
    return this.admin.deletePromo(id, u.id);
  }

  // --- Banners (Slice 3b-3) ---
  @Get('banners') @ApiOperation({ summary: 'List banners by position' })
  listBanners(@Query() query: ListBannersQueryDto) {
    return this.admin.listBanners(query);
  }

  @Post('banners') @ApiOperation({ summary: 'Create banner (appended to end)' })
  createBanner(@CurrentUser() u: AuthedUser, @Body() dto: CreateBannerDto) {
    return this.admin.createBanner(dto, u.id);
  }

  @Put('banners/:id') @ApiOperation({ summary: 'Update banner fields (not position)' })
  updateBanner(
    @CurrentUser() u: AuthedUser,
    @Param('id') id: string,
    @Body() dto: UpdateBannerDto,
  ) {
    return this.admin.updateBanner(id, dto, u.id);
  }

  @Delete('banners/:id') @ApiOperation({ summary: 'Hard-delete banner' })
  deleteBanner(@CurrentUser() u: AuthedUser, @Param('id') id: string) {
    return this.admin.deleteBanner(id, u.id);
  }

  @Post('banners/:id/move') @ApiOperation({ summary: 'Swap banner position with sibling' })
  moveBanner(
    @CurrentUser() u: AuthedUser,
    @Param('id') id: string,
    @Body() dto: MoveBannerDto,
  ) {
    return this.admin.moveBanner(id, dto, u.id);
  }

  @Post('banners/:id/image')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: MAX_UPLOAD_BYTES },
      fileFilter: imageMimeFilter,
    }),
  )
  @ApiOperation({ summary: 'Upload banner image (WebP via sharp pipeline)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
      required: ['file'],
    },
  })
  uploadBannerImage(
    @CurrentUser() u: AuthedUser,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.admin.uploadBannerImage(id, file, u.id);
  }

  // --- Orders ---
  @Get('orders') @ApiOperation({ summary: 'List all orders (filterable)' })
  listOrders(@Query() filters: Record<string, string>) {
    return this.admin.listOrders(filters);
  }

  @Get('orders/:id') @ApiOperation({ summary: 'Order detail with items, customer, address and history' })
  getOrder(@Param('id') id: string) {
    return this.admin.getOrder(id);
  }

  @Put('orders/:id/status') @ApiOperation({ summary: 'Update order status' })
  updateOrderStatus(
    @CurrentUser() u: AuthedUser,
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.admin.updateOrderStatus(id, dto, u.id);
  }

  @Put('orders/:id/payment') @ApiOperation({ summary: 'Confirm or reject payment' })
  updateOrderPayment(
    @CurrentUser() u: AuthedUser,
    @Param('id') id: string,
    @Body() dto: UpdateOrderPaymentDto,
  ) {
    return this.admin.updateOrderPayment(id, dto, u.id);
  }

  // --- Products ---
  @Get('products') @ApiOperation({ summary: 'List products (admin scope; includes inactive)' })
  listProducts(@Query() filters: Record<string, string>) {
    return this.admin.getProducts(filters);
  }

  @Get('products/:id') @ApiOperation({ summary: 'Product detail (admin scope)' })
  getProduct(@Param('id') id: string) {
    return this.admin.getProduct(id);
  }

  @Post('products') @ApiOperation({ summary: 'Create product' })
  createProduct(@CurrentUser() u: AuthedUser, @Body() dto: CreateProductDto) {
    return this.admin.createProduct(dto, u.id);
  }

  @Put('products/:id') @ApiOperation({ summary: 'Update product' })
  updateProduct(
    @CurrentUser() u: AuthedUser,
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.admin.updateProduct(id, dto, u.id);
  }

  @Delete('products/:id') @ApiOperation({ summary: 'Soft delete product' })
  deleteProduct(@CurrentUser() u: AuthedUser, @Param('id') id: string) {
    return this.admin.deleteProduct(id, u.id);
  }

  @Post('products/:id/images')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: MAX_UPLOAD_BYTES },
      fileFilter: imageMimeFilter,
    }),
  )
  @ApiOperation({ summary: 'Upload a product image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        is_primary: { type: 'boolean' },
        sort_order: { type: 'integer' },
      },
      required: ['file'],
    },
  })
  uploadProductImages(
    @CurrentUser() u: AuthedUser,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadProductImageDto,
  ) {
    return this.admin.uploadProductImages(id, file, dto, u.id);
  }

  @Put('products/:id/images/:imageId') @ApiOperation({ summary: 'Update a product image (primary/sort/alt)' })
  updateProductImage(
    @CurrentUser() u: AuthedUser,
    @Param('id') productId: string,
    @Param('imageId') imageId: string,
    @Body() dto: UpdateProductImageDto,
  ) {
    return this.admin.updateProductImage(productId, imageId, dto, u.id);
  }

  @Delete('products/:id/images/:imageId') @ApiOperation({ summary: 'Delete a product image' })
  deleteProductImage(
    @CurrentUser() u: AuthedUser,
    @Param('id') productId: string,
    @Param('imageId') imageId: string,
  ) {
    return this.admin.deleteProductImage(productId, imageId, u.id);
  }

  // --- Categories ---
  @Get('categories') @ApiOperation({ summary: 'List all categories (admin scope; includes inactive)' })
  listCategories() {
    return this.admin.getCategories();
  }

  @Post('categories') @ApiOperation({ summary: 'Create category' })
  createCategory(@CurrentUser() u: AuthedUser, @Body() dto: CreateCategoryDto) {
    return this.admin.createCategory(dto, u.id);
  }

  @Put('categories/:id') @ApiOperation({ summary: 'Update category' })
  updateCategory(
    @CurrentUser() u: AuthedUser,
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.admin.updateCategory(id, dto, u.id);
  }

  // --- Customers ---
  @Get('customers') @ApiOperation({ summary: 'List customers' })
  listCustomers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('q') q?: string,
  ) {
    return this.admin.listCustomers(
      page ? Number(page) : undefined,
      limit ? Number(limit) : undefined,
      q,
    );
  }

  @Get('customers/:id') @ApiOperation({ summary: 'Customer detail + history' })
  customerDetail(@Param('id') id: string) { return this.admin.customerDetail(id); }

  // --- Delivery & settings ---
  @Put('delivery/zones/:zone') @ApiOperation({ summary: 'Update zone fee + ETA' })
  updateZoneFee(
    @CurrentUser() u: AuthedUser,
    @Param('zone') zone: DeliveryZone,
    @Body() dto: UpdateZoneFeeDto,
  ) {
    return this.admin.updateZoneFee(zone, dto, u.id);
  }

  @Get('settings') @ApiOperation({ summary: 'Get app settings' })
  getSettings() { return this.admin.getSettings(); }

  @Put('settings') @ApiOperation({ summary: 'Update app settings' })
  updateSettings(@CurrentUser() u: AuthedUser, @Body() dto: UpdateSettingsDto) {
    return this.admin.updateSettings(dto, u.id);
  }

  // --- Reviews moderation ---
  @Get('reviews') @ApiOperation({ summary: 'List reviews with moderation filter' })
  listReviews(@Query() query: ListAdminReviewsQueryDto) {
    return this.admin.listReviews(query);
  }

  @Get('reviews/kpis') @ApiOperation({ summary: 'Review moderation KPIs' })
  reviewKpis() {
    return this.admin.reviewKpis();
  }

  @Post('reviews/:id/approve') @ApiOperation({ summary: 'Approve & publish a review' })
  approveReview(@CurrentUser() u: AuthedUser, @Param('id') id: string) {
    return this.admin.approveReview(id, u.id);
  }

  @Post('reviews/:id/reject') @ApiOperation({ summary: 'Reject a review with a reason' })
  rejectReview(
    @CurrentUser() u: AuthedUser,
    @Param('id') id: string,
    @Body() dto: RejectReviewDto,
  ) {
    return this.admin.rejectReview(id, dto, u.id);
  }

  @Post('reviews/:id/reset') @ApiOperation({ summary: 'Move a review back to pending' })
  resetReview(@CurrentUser() u: AuthedUser, @Param('id') id: string) {
    return this.admin.resetReviewToPending(id, u.id);
  }

  // --- Staff + audit log ---
  @Get('staff') @ApiOperation({ summary: 'List active admin users' })
  listStaff() {
    return this.admin.listStaff();
  }

  @Get('audit-log') @ApiOperation({ summary: 'Recent audit log entries' })
  listAuditFeed(@Query() query: ListAuditFeedQueryDto) {
    return this.admin.listAuditFeed(query);
  }
}
