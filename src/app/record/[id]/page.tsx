import React, { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { RecordDetailView } from '@/components/record/RecordDetailView'
import { getMockRecordById, MOCK_BURIAL_RECORDS } from '@/lib/mockData'

export function generateStaticParams() {
  return MOCK_BURIAL_RECORDS.map((record) => ({
    id: record.id,
  }))
}


async function RecordContent({ id }: { id: string }) {
  const recordDetail = getMockRecordById(id)

  if (!recordDetail) {
    notFound()
  }

  return <RecordDetailView record={recordDetail} />
}

export default async function RecordPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div className="container-content py-12 flex-grow">
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20">
            <div className="spinner"></div>
          </div>
        }
      >
        <RecordContent id={id} />
      </Suspense>
    </div>
  )
}
