import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { v4 } from 'uuid';
import { CreateProductDto } from './dtos/product.create.dto';

@Injectable()
export class SearchService {
  constructor(private readonly elasticSearchService: ElasticsearchService) {}

  async search(searchQuery: string) {
    return await this.elasticSearchService.search({
      query: {
        bool: {
          should: [
            {
              wildcard: {
                name: {
                  value: '*' + searchQuery + '*',
                  boost: 1.0,
                  rewrite: 'constant_score',
                },
              },
            },
            {
              match: {
                name: {
                  query: searchQuery,
                  operator: 'OR',
                  fuzziness: 'auto',
                },
              },
            },
          ],
        },
      },
      suggest: {
        text: searchQuery,
        simple_phrase: {
          phrase: {
            field: 'name',
            size: 1,
            gram_size: 1,
            direct_generator: [
              {
                field: 'name',
                suggest_mode: 'always',
              },
            ],
            highlight: {
              pre_tag: '<em>',
              post_tag: '</em>',
            },
          },
        },
      },
    });
  }

  addProduct(data: CreateProductDto) {
    return this.elasticSearchService.create({
      id: v4(),
      index: 'products',
      document: data,
    });
  }

  removeProduct(data: { id: string }) {
    this.elasticSearchService.delete({ index: 'products', id: data.id });
  }
}
