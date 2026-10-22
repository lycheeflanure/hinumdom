import React, { Suspense } from 'react'
import Link from 'next/link'
import { SearchForm } from '@/components/search/SearchForm'
import { SearchResultCard } from '@/components/search/SearchResultCard'
import { searchMockRecords, MOCK_CEMETERY } from '@/lib/mockData'

async function SearchContent({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const resolvedParams = await searchParams
  const rawQ = resolvedParams?.q || ''
  const q = rawQ.trim()
  const page = resolvedParams?.page || '1'
  const currentPage = parseInt(page, 10) || 1
  const pageSize = 10

  const hasSearch = q.length > 0
  const { results, total: totalCount } = hasSearch
    ? searchMockRecords(q, currentPage, pageSize)
    : { results: [], total: 0 }
  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <div
      className={`container-content flex-grow flex flex-col w-full ${
        hasSearch
          ? 'pt-10 md:pt-14 pb-24 md:pb-32 justify-start'
          : 'py-20 md:py-32 justify-center my-auto'
      }`}
    >
      <div className="max-w-3xl mx-auto w-full">
        <div className="mb-8 text-center mt-2 md:mt-4">
          <h1 className="heading-display mb-3 text-3xl md:text-5xl font-bold tracking-tight">
            Search Records
          </h1>
          <p className="text-text-muted text-base max-w-xl mx-auto">
            Find the final resting place of loved ones in {MOCK_CEMETERY.name}.
          </p>
        </div>

        <div className={!hasSearch ? "mb-16 md:mb-24" : "mb-8"}>
          <SearchForm initialQuery={rawQ} />
        </div>

        {hasSearch && (
          <div className="mt-10">
            {results.length === 0 ? (
              <div className="empty-state bg-surface border border-border-light rounded-xl p-8 text-center">
                <p className="text-text-muted">
                  No matching burial record was found for &ldquo;{q}&rdquo;. Please check the spelling or contact the cemetery office for assistance.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-text-muted">
                    Found <strong className="text-text">{totalCount}</strong> result{totalCount !== 1 ? 's' : ''} for &ldquo;{q}&rdquo;
                  </p>
                </div>

                <div className="grid gap-4">
                  {results.map((record) => (
                    <SearchResultCard key={record.id} record={record} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination mt-8 flex justify-center gap-2">
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const p = i + 1
                      return (
                        <Link
                          key={p}
                          href={`/search?q=${encodeURIComponent(q)}&page=${p}`}
                          className={`pagination-btn ${p === currentPage ? 'pagination-btn-active' : ''}`}
                        >
                          {p}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  return (
    <Suspense
      fallback={
        <div className="container-content py-16 flex-grow flex items-center justify-center">
          <div className="spinner"></div>
        </div>
      }
    >
      <SearchContent searchParams={searchParams} />
    </Suspense>
  )
}
