export function blocStateTemplate(blocClassName: string, blocFilename: string): string {
  return `
part of '${blocFilename}_bloc.dart';

enum ${blocClassName}Status { initial, loading, success, failure }

class ${blocClassName}State extends Equatable {
  
  final ${blocClassName}Status status;

  const ${blocClassName}State({
    this.status = ${blocClassName}Status.initial,
  });

  @override
  List<Object?> get props => [status];

  bool get isInitial => status == ${blocClassName}Status.initial;
  bool get isLoading => status == ${blocClassName}Status.loading;
  bool get isSuccess => status == ${blocClassName}Status.success;
  bool get isFailure => status == ${blocClassName}Status.failure;

  ${blocClassName}State copyWith({
    ${blocClassName}Status? status,
  }) {
    return ${blocClassName}State(
      status: status ?? this.status,
    );
  }
}
`.trim();
}
