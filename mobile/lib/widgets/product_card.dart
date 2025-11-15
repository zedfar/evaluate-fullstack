import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/product.dart';

class ProductCard extends StatelessWidget {
  final Product product;
  final VoidCallback? onTap;

  const ProductCard({
    super.key,
    required this.product,
    this.onTap,
  });

  Color _getStockColor() {
    if (product.stockStatus == 'red' || product.stock < product.lowStockThreshold) {
      return Colors.red;
    } else if (product.stockStatus == 'yellow' || product.stock == product.lowStockThreshold) {
      return Colors.orange;
    } else {
      return Colors.green;
    }
  }

  String _getStockText() {
    if (product.stock == 0) {
      return 'Out of Stock';
    } else if (product.stock < product.lowStockThreshold) {
      return 'Low Stock';
    } else {
      return 'In Stock';
    }
  }

  @override
  Widget build(BuildContext context) {
    final currencyFormatter = NumberFormat.currency(
      locale: 'id_ID',
      symbol: 'Rp ',
      decimalDigits: 0,
    );

    return Card(
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Product Image
            Expanded(
              child: Container(
                width: double.infinity,
                color: Colors.grey[200],
                child: product.imageUrl != null
                    ? Image.network(
                        product.imageUrl!,
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) {
                          return const Icon(
                            Icons.image_not_supported,
                            size: 48,
                            color: Colors.grey,
                          );
                        },
                      )
                    : const Icon(
                        Icons.inventory_2,
                        size: 48,
                        color: Colors.grey,
                      ),
              ),
            ),

            // Product Info
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Product Name
                  Text(
                    product.name,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                    ),
                  ),
                  const SizedBox(height: 4),

                  // Category
                  if (product.category != null)
                    Text(
                      product.category!.name,
                      style: TextStyle(
                        fontSize: 12,
                        color: Colors.grey[600],
                      ),
                    ),
                  const SizedBox(height: 4),

                  // Price
                  Text(
                    currencyFormatter.format(product.price),
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Colors.blue,
                    ),
                  ),
                  const SizedBox(height: 4),

                  // Stock Status
                  Row(
                    children: [
                      Container(
                        width: 8,
                        height: 8,
                        decoration: BoxDecoration(
                          color: _getStockColor(),
                          shape: BoxShape.circle,
                        ),
                      ),
                      const SizedBox(width: 4),
                      Text(
                        _getStockText(),
                        style: TextStyle(
                          fontSize: 12,
                          color: _getStockColor(),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
