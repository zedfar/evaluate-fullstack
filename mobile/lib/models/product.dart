import 'package:equatable/equatable.dart';
import 'package:json_annotation/json_annotation.dart';

part 'product.g.dart';

@JsonSerializable()
class Product extends Equatable {
  final String id;
  final String name;
  final String? description;
  final double price;
  final int stock;
  @JsonKey(name: 'low_stock_threshold')
  final int lowStockThreshold;
  @JsonKey(name: 'stock_status')
  final String? stockStatus;  // Always returned by API but nullable for safety
  @JsonKey(name: 'image_url')
  final String? imageUrl;
  @JsonKey(name: 'category_id')
  final String categoryId;
  final Category? category;
  final ProductCreator? creator;
  @JsonKey(name: 'created_by')
  final String? createdBy;  // Made nullable - might not be in all responses
  @JsonKey(name: 'created_at')
  final String? createdAt;  // Made nullable - might not be in all responses
  @JsonKey(name: 'updated_at')
  final String? updatedAt;  // Made nullable - might not be in all responses

  const Product({
    required this.id,
    required this.name,
    this.description,
    required this.price,
    required this.stock,
    required this.lowStockThreshold,
    this.stockStatus,
    this.imageUrl,
    required this.categoryId,
    this.category,
    this.creator,
    this.createdBy,
    this.createdAt,
    this.updatedAt,
  });

  factory Product.fromJson(Map<String, dynamic> json) =>
      _$ProductFromJson(json);

  Map<String, dynamic> toJson() => _$ProductToJson(this);

  @override
  List<Object?> get props => [
        id,
        name,
        description,
        price,
        stock,
        lowStockThreshold,
        stockStatus,
        imageUrl,
        categoryId,
        category,
        creator,
        createdBy,
        createdAt,
        updatedAt,
      ];

  Product copyWith({
    String? id,
    String? name,
    String? description,
    double? price,
    int? stock,
    int? lowStockThreshold,
    String? stockStatus,
    String? imageUrl,
    String? categoryId,
    Category? category,
    ProductCreator? creator,
    String? createdBy,
    String? createdAt,
    String? updatedAt,
  }) {
    return Product(
      id: id ?? this.id,
      name: name ?? this.name,
      description: description ?? this.description,
      price: price ?? this.price,
      stock: stock ?? this.stock,
      lowStockThreshold: lowStockThreshold ?? this.lowStockThreshold,
      stockStatus: stockStatus ?? this.stockStatus,
      imageUrl: imageUrl ?? this.imageUrl,
      categoryId: categoryId ?? this.categoryId,
      category: category ?? this.category,
      creator: creator ?? this.creator,
      createdBy: createdBy ?? this.createdBy,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}

@JsonSerializable()
class Category extends Equatable {
  final String id;
  final String name;
  final String? description;
  @JsonKey(name: 'created_by')
  final String? createdBy;  // Made nullable
  @JsonKey(name: 'created_at')
  final String? createdAt;  // Made nullable
  @JsonKey(name: 'updated_at')
  final String? updatedAt;  // Made nullable

  const Category({
    required this.id,
    required this.name,
    this.description,
    this.createdBy,
    this.createdAt,
    this.updatedAt,
  });

  factory Category.fromJson(Map<String, dynamic> json) =>
      _$CategoryFromJson(json);

  Map<String, dynamic> toJson() => _$CategoryToJson(this);

  @override
  List<Object?> get props =>
      [id, name, description, createdBy, createdAt, updatedAt];
}

@JsonSerializable()
class ProductCreator extends Equatable {
  final String id;
  final String username;
  final String? email;  // Made nullable - API doesn't always send this field

  const ProductCreator({
    required this.id,
    required this.username,
    this.email,  // Optional parameter
  });

  factory ProductCreator.fromJson(Map<String, dynamic> json) =>
      _$ProductCreatorFromJson(json);

  Map<String, dynamic> toJson() => _$ProductCreatorToJson(this);

  @override
  List<Object?> get props => [id, username, email];
}

@JsonSerializable()
class CreateProductData {
  final String name;
  final String? description;
  final double price;
  final int stock;
  @JsonKey(name: 'low_stock_threshold')
  final int lowStockThreshold;
  @JsonKey(name: 'image_url')
  final String? imageUrl;
  @JsonKey(name: 'category_id')
  final String categoryId;

  const CreateProductData({
    required this.name,
    this.description,
    required this.price,
    required this.stock,
    required this.lowStockThreshold,
    this.imageUrl,
    required this.categoryId,
  });

  Map<String, dynamic> toJson() => _$CreateProductDataToJson(this);
}

@JsonSerializable()
class UpdateProductData {
  final String? name;
  final String? description;
  final double? price;
  final int? stock;
  @JsonKey(name: 'low_stock_threshold')
  final int? lowStockThreshold;
  @JsonKey(name: 'image_url')
  final String? imageUrl;
  @JsonKey(name: 'category_id')
  final String? categoryId;

  const UpdateProductData({
    this.name,
    this.description,
    this.price,
    this.stock,
    this.lowStockThreshold,
    this.imageUrl,
    this.categoryId,
  });

  Map<String, dynamic> toJson() => _$UpdateProductDataToJson(this);
}
