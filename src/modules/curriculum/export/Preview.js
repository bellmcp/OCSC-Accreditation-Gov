import React from 'react'
import { get, size } from 'lodash'
import ReactHTMLTableToExcel from 'react-html-table-to-excel'
import './preview.css'
import { format } from 'date-fns'

export default function Preview({ curricularLetters }) {
  function section() {
    return (
      <tr>
        <td
          colspan='5'
          className='border-top-none border-left-none border-right-none height-60'
        ></td>
      </tr>
    )
  }

  function sectionLast() {
    return (
      <tr>
        <td colspan='5' className='border-none height-60'></td>
      </tr>
    )
  }

  return (
    <div>
      <ReactHTMLTableToExcel
        id='download-xls-button'
        className='download-table-xls-button'
        table='curriculum'
        filename={`ผลการรับรองคุณวุฒิ_${format(
          new Date(),
          'yyyy-MM-dd-HH:mm:ss'
        ).toString()}`}
        sheet='ผลการรับรองคุณวุฒิ'
        buttonText='ดาวน์โหลด .XLS'
      />
      <table id='curriculum'>
        {curricularLetters.map((curricularLetter) => {
          return (
            <>
              <tr>
                <th colspan='5' className='border-none title'>
                  {get(curricularLetter, 'university', '')}
                </th>
              </tr>

              <tr>
                <td colspan='5' className='border-none'>
                  <span style={{ marginLeft: 60 }}></span>
                  {get(curricularLetter, 'note', '')}
                </td>
              </tr>

              {section()}

              <tr>
                <th>ลำดับที่</th>
                <th>ชื่อปริญญา/ประกาศนียบัตร</th>
                <th>สาขาวิชา/วิชาเอก</th>
                <th>ผลการรับรอง</th>
                <th>หมายเหตุ</th>
              </tr>

              {get(curricularLetter, 'faculties', []).map((faculty, index) => {
                return (
                  <>
                    <tr>
                      <th colspan='5'>{get(faculty, 'name', '')}</th>
                    </tr>
                    {get(faculty, 'curriculums', []).map((curriculum) => (
                      <tr>
                        <td className='text-center'>
                          {get(curriculum, 'no', '')}
                        </td>
                        <td>{get(curriculum, 'degree', '')}</td>
                        <td>{get(curriculum, 'branch', '')}</td>
                        <td>{get(curriculum, 'accreditation', '')}</td>
                        <td>{get(curriculum, 'note', '')}</td>
                      </tr>
                    ))}
                    {index === size(get(curricularLetter, 'faculties', [])) - 1
                      ? sectionLast()
                      : section()}
                  </>
                )
              })}
            </>
          )
        })}
      </table>
    </div>
  )
}
