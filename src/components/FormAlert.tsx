import { XCircleIcon } from '@heroicons/react/20/solid'

const FormSubmitFeedback = (props: { msg: string }) => {
    return (
        <div className="rounded-md bg-red-50 p-4 mb-3">
            <div className="flex">
                <div className="shrink-0">
                    <XCircleIcon aria-hidden="true" className="size-5 text-red-400" />
                </div>
                <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">{props.msg}</p>
                </div>
            </div>
        </div>
    )
}

export default FormSubmitFeedback